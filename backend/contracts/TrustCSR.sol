// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./POI.sol";

contract TrustCSR {
    enum ProjectStatus { Submitted, Approved, Rejected }

    struct CSRProject {
        uint256 id;
        address company;
        string title;
        string description;
        uint256 startDate;
        uint256 endDate;
        string location;
        uint256 amountSpent;
        string invoiceHash;
        string mediaHash;
        string beneficiary;
        ProjectStatus status;
        uint256 approvals;
        uint256 rejections;
        address[] voters;
        mapping(address => bool) hasVoted;
    }

    address public admin;
    uint256 public projectCounter;
    ProofOfImpact public token;

    // DAO membership mapping and array for enumeration
    mapping(address => bool) public isDAOMember;
    address[] public daoMembers;

    // Projects storage
    mapping(uint256 => CSRProject) private projectsInternal;

    // Events
    event ProjectSubmitted(uint256 indexed projectId, address indexed company);
    event Voted(uint256 indexed projectId, address indexed voter, bool approved);
    event ProjectApproved(uint256 indexed projectId);
    event ProjectRejected(uint256 indexed projectId);
    event DAOMemberAdded(address indexed member);
    event DAOMemberRemoved(address indexed member);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this");
        _;
    }

    modifier onlyDAOMember() {
        require(isDAOMember[msg.sender], "Only DAO members can vote");
        _;
    }

    constructor(address tokenAddress) {
        admin = msg.sender;
        token = ProofOfImpact(tokenAddress);
    }

    // --- Admin functions to manage DAO members ---

    function addDAOMember(address member) external onlyAdmin {
        require(!isDAOMember[member], "Already a DAO member");
        isDAOMember[member] = true;
        daoMembers.push(member);
        emit DAOMemberAdded(member);
    }

    function removeDAOMember(address member) external onlyAdmin {
        require(isDAOMember[member], "Not a DAO member");
        isDAOMember[member] = false;

        // Remove from daoMembers array (simple method)
        for (uint i = 0; i < daoMembers.length; i++) {
            if (daoMembers[i] == member) {
                daoMembers[i] = daoMembers[daoMembers.length - 1];
                daoMembers.pop();
                break;
            }
        }
        emit DAOMemberRemoved(member);
    }

    function getAdmin() external view returns (address) {
        return admin;
    }

    function getDAOMembers() external view returns (address[] memory) {
        return daoMembers;
    }

    // --- Project submission ---

    function submitProject(
        string memory title,
        string memory description,
        uint256 startDate,
        uint256 endDate,
        string memory location,
        uint256 amountSpent,
        string memory invoiceHash,
        string memory mediaHash,
        string memory beneficiary
    ) external {
        projectCounter++;
        CSRProject storage p = projectsInternal[projectCounter];
        p.id = projectCounter;
        p.company = msg.sender;
        p.title = title;
        p.description = description;
        p.startDate = startDate;
        p.endDate = endDate;
        p.location = location;
        p.amountSpent = amountSpent;
        p.invoiceHash = invoiceHash;
        p.mediaHash = mediaHash;
        p.beneficiary = beneficiary;
        p.status = ProjectStatus.Submitted;

        emit ProjectSubmitted(projectCounter, msg.sender);
    }

    // --- Voting on project by DAO members ---

    function voteProject(uint256 projectId, bool approve) external onlyDAOMember {
        require(projectId > 0 && projectId <= projectCounter, "Invalid project ID");
        CSRProject storage p = projectsInternal[projectId];

        require(p.status == ProjectStatus.Submitted, "Voting closed");
        require(!p.hasVoted[msg.sender], "Already voted");

        p.hasVoted[msg.sender] = true;
        p.voters.push(msg.sender);

        if (approve) {
            p.approvals++;
        } else {
            p.rejections++;
        }

        emit Voted(projectId, msg.sender, approve);

        uint256 quorum = getQuorum();

        if (p.approvals >= quorum) {
            p.status = ProjectStatus.Approved;
            emit ProjectApproved(projectId);
            rewardParticipants(projectId, true);
        } else if (p.rejections >= quorum) {
            p.status = ProjectStatus.Rejected;
            emit ProjectRejected(projectId);
            rewardParticipants(projectId, false);
        }
    }

    // --- Internal logic ---

    function getQuorum() public view returns (uint256) {
        // More than half of DAO members
        uint256 count = daoMembers.length;
        require(count > 0, "No DAO members");
        return (count / 2) + 1;
    }

    function rewardParticipants(uint256 projectId, bool approved) internal {
        CSRProject storage p = projectsInternal[projectId];
        if (approved) {
            // Reward company with 100 POI tokens
            token.mint(p.company, 100 * 1e18);

            // Reward DAO voters with 10 POI tokens each
            for (uint i = 0; i < p.voters.length; i++) {
                token.mint(p.voters[i], 10 * 1e18);
            }
        }
    }

    // --- View functions ---

    function getProjectSummary(uint256 projectId) external view returns (
        string memory title,
        string memory description,
        address company,
        uint256 amountSpent,
        ProjectStatus status,
        uint256 approvals,
        uint256 rejections
    ) {
        require(projectId > 0 && projectId <= projectCounter, "Invalid project ID");
        CSRProject storage p = projectsInternal[projectId];
        return (
            p.title,
            p.description,
            p.company,
            p.amountSpent,
            p.status,
            p.approvals,
            p.rejections
        );
    }

    function getUserPOIBalance(address user) external view returns (uint256) {
        return token.balanceOf(user);
    }

    function getContractPOIBalance() external view returns (uint256) {
        return token.balanceOf(address(this));
    }

    // --- Admin withdraw tokens from contract if needed ---

    function withdrawAllPOITokens() external onlyAdmin {
        uint256 balance = token.balanceOf(address(this));
        require(balance > 0, "No tokens to withdraw");
        token.transfer(admin, balance);
    }

    // --- Stats for projects ---

    function getTotalProjects() external view returns (uint256) {
        return projectCounter;
    }

    function getApprovedProjectsCount() external view returns (uint256 count) {
        for (uint256 i = 1; i <= projectCounter; i++) {
            if (projectsInternal[i].status == ProjectStatus.Approved) {
                count++;
            }
        }
    }

    function getPendingProjectsCount() external view returns (uint256 count) {
        for (uint256 i = 1; i <= projectCounter; i++) {
            if (projectsInternal[i].status == ProjectStatus.Submitted) {
                count++;
            }
        }
    }

    function getRejectedProjectsCount() external view returns (uint256 count) {
        for (uint256 i = 1; i <= projectCounter; i++) {
            if (projectsInternal[i].status == ProjectStatus.Rejected) {
                count++;
            }
        }
    }
}


//contract address - 0x9142b004cA8A4D2ed4892c3850Db112bFC2fcD08
//tx explorer - https://seitrace.com/tx/0x76dfc0a9e68851b6d6405a96e18ea2bd19be90a0b933b58f211da0d83bac48c0?chain=atlantic-2