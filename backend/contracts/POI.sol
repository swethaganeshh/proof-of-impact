// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.27;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract ProofOfImpact is ERC20, Ownable, ERC20Permit {
    constructor(address initialOwner)
        ERC20("ProofOfImpact", "POI")
        Ownable(initialOwner)
        ERC20Permit("ProofOfImpact")
    {}

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}

//contract address - 0x541a34ab4cB430596AcdDeCAcFa3710c71127518
//tx explorer- https://seitrace.com/tx/0x0a835024d212cc60ae6e50a86b6a4e92db154d6cd5495ba4453cad9c8d440d57?chain=atlantic-2