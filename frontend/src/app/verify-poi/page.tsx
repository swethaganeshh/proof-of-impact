"use client";

import Navbar from "@/components/navbar";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, X, ThumbsUp, ThumbsDown, Image, FileText, IndianRupee, CheckCircle2 } from "lucide-react";
import { POI_CONTRACT_ADDRESS, POI_ABI } from "@/abi";
import { createPublicClient, custom, createWalletClient } from 'viem';
import { qieTestnet } from '@/lib/qie-chain';

// Mock data for CSR activities
const mockCsrActivities = [
  {
    id: 1,
    title: "Toilet Construction in Villupuram",
    description: "CSR initiative to improve sanitation for rural women.",
    fullDescription: "A comprehensive sanitation project aimed at constructing 50 toilets for rural women in Villupuram district. This initiative addresses the critical need for private and safe sanitation facilities, particularly benefiting women and young girls in the community.",
    beneficiary: "Self Help Group - Villupuram",
    date: "May 2025",
    dateRange: "01 May 2025 - 30 May 2025",
    company: "BuildTech Solutions Ltd.",
    location: "Villupuram, Tamil Nadu",
    amount: 1200000,
    images: [
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800",
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800"
    ],
    documents: ["Financial_Report.pdf", "Construction_Timeline.pdf"],
    invoiceDetails: [
      { id: 1, description: "Materials", amount: 800000 },
      { id: 2, description: "Labor", amount: 200000 },
      { id: 3, description: "Transportation", amount: 200000 }
    ],
    status: "Pending Verification"
  },
  {
    id: 2,
    title: "Digital Literacy Camp – Chennai",
    description: "Free laptop and training for underprivileged youth.",
    fullDescription: "A month-long digital literacy program providing laptops and comprehensive IT training to 100 underprivileged youth. The program covers basic computer skills, internet usage, and professional software applications to enhance employability.",
    beneficiary: "Youth of Nungambakkam",
    date: "April 2025",
    dateRange: "01 April 2025 - 30 April 2025",
    company: "TechForward Industries",
    location: "Nungambakkam, Chennai",
    amount: 500000,
    images: [
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800"
    ],
    documents: ["Training_Curriculum.pdf", "Attendance_Records.pdf"],
    invoiceDetails: [
      { id: 1, description: "Laptops", amount: 200000 },
      { id: 2, description: "Training Materials", amount: 100000 },
      { id: 3, description: "Trainer Fees", amount: 200000 }
    ],
    status: "Pending Verification"
  },
  {
    id: 3,
    title: "Rural Healthcare Camp",
    description: "Free medical checkups and medicine distribution.",
    fullDescription: "A comprehensive healthcare initiative providing free medical checkups, consultations, and medicine distribution to rural communities. Specialized doctors from various fields conducted thorough health assessments.",
    beneficiary: "Rural Communities - Madurai",
    date: "June 2025",
    dateRange: "15 June 2025 - 20 June 2025",
    company: "HealthCare Plus",
    location: "Madurai District",
    amount: 800000,
    images: [
      "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800",
      "https://images.unsplash.com/photo-1583912267550-d6c2ac3196c2?w=800"
    ],
    documents: ["Medical_Records.pdf", "Medicine_Distribution.pdf"],
    invoiceDetails: [
      { id: 1, description: "Medicine", amount: 400000 },
      { id: 2, description: "Doctor Fees", amount: 200000 },
      { id: 3, description: "Transportation", amount: 200000 }
    ],
    status: "Pending Verification"
  },
  {
    id: 4,
    title: "Tree Plantation Drive",
    description: "Environmental initiative to plant 1000 trees.",
    fullDescription: "A green initiative aimed at improving urban air quality and biodiversity. The project involves planting 1000 native tree species across various locations in the city, with a focus on creating sustainable urban forests.",
    beneficiary: "Local Communities - Coimbatore",
    date: "July 2025",
    dateRange: "01 July 2025 - 31 July 2025",
    company: "GreenEarth Enterprises",
    location: "Coimbatore",
    amount: 600000,
    images: [
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800",
      "https://images.unsplash.com/photo-1618067440360-5b3762c7ed04?w=800"
    ],
    documents: ["Plantation_Plan.pdf", "Environmental_Impact.pdf"],
    invoiceDetails: [
      { id: 1, description: "Trees", amount: 300000 },
      { id: 2, description: "Labor", amount: 200000 },
      { id: 3, description: "Transportation", amount: 100000 }
    ],
    status: "Pending Verification"
  },
  {
    id: 5,
    title: "Women's Skill Development",
    description: "Vocational training for rural women entrepreneurs.",
    fullDescription: "An empowerment program providing vocational training in tailoring, handicrafts, and basic business management to rural women. The initiative aims to create sustainable livelihood opportunities.",
    beneficiary: "Women's Self Help Groups - Salem",
    date: "August 2025",
    dateRange: "01 August 2025 - 30 September 2025",
    company: "EmpowerHer Foundation",
    location: "Salem District",
    amount: 700000,
    images: [
      "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800",
      "https://images.unsplash.com/photo-1604881991720-f91add269bed?w=800"
    ],
    documents: ["Training_Modules.pdf", "Impact_Assessment.pdf"],
    invoiceDetails: [
      { id: 1, description: "Training Materials", amount: 300000 },
      { id: 2, description: "Trainer Fees", amount: 200000 },
      { id: 3, description: "Transportation", amount: 200000 }
    ],
    status: "Pending Verification"
  },
  {
    id: 6,
    title: "Clean Water Project",
    description: "Installation of water purification systems.",
    fullDescription: "Installation of advanced water purification systems in 10 villages, providing clean drinking water to over 5000 residents. The project includes regular maintenance and water quality testing protocols.",
    beneficiary: "Village Panchayats - Tirunelveli",
    date: "September 2025",
    dateRange: "01 September 2025 - 31 October 2025",
    company: "AquaPure Solutions",
    location: "Tirunelveli District",
    amount: 900000,
    images: [
      "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800",
      "https://images.unsplash.com/photo-1562016600-ece13e8ba570?w=800"
    ],
    documents: ["Technical_Specifications.pdf", "Water_Quality_Reports.pdf"],
    invoiceDetails: [
      { id: 1, description: "Purification Systems", amount: 500000 },
      { id: 2, description: "Installation", amount: 200000 },
      { id: 3, description: "Maintenance", amount: 200000 }
    ],
    status: "Pending Verification"
  },
  {
    id: 7,
    title: "Solar Power for Schools",
    description: "Renewable energy installation in rural schools.",
    fullDescription: "Implementation of solar power systems in 15 rural schools, reducing electricity costs and providing sustainable energy. The project includes educational workshops on renewable energy for students.",
    beneficiary: "Government Schools - Erode",
    date: "October 2025",
    dateRange: "01 October 2025 - 30 November 2025",
    company: "SolarTech Innovations",
    location: "Erode District",
    amount: 1200000,
    images: [
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800",
      "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800"
    ],
    documents: ["Installation_Report.pdf", "Energy_Savings_Analysis.pdf"],
    invoiceDetails: [
      { id: 1, description: "Solar Panels", amount: 600000 },
      { id: 2, description: "Installation", amount: 300000 },
      { id: 3, description: "Maintenance", amount: 300000 }
    ],
    status: "Pending Verification"
  }
];

interface VotingModalProps {
  activity: typeof mockCsrActivities[0];
  onClose: () => void;
}

interface ProjectSummary {
  id: number;
  title: string;
  description: string;
  company: string;
  amount: number;
  status: string;
  approvals: number;
  rejections: number;
}

// Minimal local type for EthereumProvider to satisfy viem custom transport
type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (...args: unknown[]) => void;
  removeListener?: (...args: unknown[]) => void;
};

export default function VerifyPOIPage() {
  const [activities, setActivities] = useState(mockCsrActivities);
  const [selectedActivity, setSelectedActivity] = useState<typeof mockCsrActivities[0] | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isDaoMember, setIsDaoMember] = useState<boolean | null>(null);
  const [checkingDao, setCheckingDao] = useState(false);
  const [realProjects, setRealProjects] = useState<ProjectSummary[]>([]);
  const [voting, setVoting] = useState(false);
  const [voteError, setVoteError] = useState<string | null>(null);
  const [voteTxHash, setVoteTxHash] = useState<string | null>(null);
  const [showVoteSuccess, setShowVoteSuccess] = useState(false);

  const handleVerification = (activityId: number) => {
    setActivities(activities.map(activity => 
      activity.id === activityId 
        ? { ...activity, status: "Verified" }
        : activity
    ));
  };

  // Connect MetaMask wallet
  const connectWallet = async () => {
    try {
      const ethWin = window as Window & { ethereum?: unknown };
      if (!ethWin.ethereum) {
        alert('MetaMask is not installed');
        return null;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const accounts = await (ethWin.ethereum as any).request({ method: 'eth_requestAccounts' });
      setWalletAddress(accounts[0]);
      return accounts[0];
    } catch {
      alert('Failed to connect wallet');
      return null;
    }
  };

  // Check DAO membership
 const handleCheckDaoMember = async () => {
  setCheckingDao(true);
  try {
    let address = walletAddress;

    if (!address) {
      address = await connectWallet();
      if (!address) return;
    }

    const ethWin = window as Window & { ethereum?: unknown };
    if (!ethWin.ethereum) {
      console.error("Ethereum provider not found");
      setIsDaoMember(false);
      return;
    }

    const client = createPublicClient({
      chain: qieTestnet,
      transport: custom(ethWin.ethereum as EthereumProvider),
    });

    const result = await client.readContract({
      address: POI_CONTRACT_ADDRESS as `0x${string}`,
      abi: POI_ABI,
      functionName: "isDAOMember",
      args: [address as `0x${string}`],
    });

    setIsDaoMember(Boolean(result));
  } catch (error) {
    console.error("DAO membership check failed:", error);
    setIsDaoMember(false);
  } finally {
    setCheckingDao(false);
  }
};


  // Fetch real projects from contract
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const client = createPublicClient({
          chain: qieTestnet,
          transport: custom((window as Window & { ethereum?: unknown }).ethereum as EthereumProvider),
        });
        const totalProjects = await client.readContract({
          address: POI_CONTRACT_ADDRESS as `0x${string}`,
          abi: POI_ABI,
          functionName: 'getTotalProjects',
        });
        const total = Number(totalProjects);
        const projects: ProjectSummary[] = [];
        for (let i = 1; i <= total; i++) {
          try {
            const summary = await client.readContract({
              address: POI_CONTRACT_ADDRESS as `0x${string}`,
              abi: POI_ABI,
              functionName: 'getProjectSummary',
              args: [BigInt(i)],
            });
            projects.push({
              id: i,
              title: summary[0] as string,
              description: summary[1] as string,
              company: summary[2] as string,
              amount: Number(summary[3]),
              status: summary[4] === 1 ? 'Approved' : summary[4] === 2 ? 'Rejected' : 'Pending Verification',
              approvals: Number(summary[5]),
              rejections: Number(summary[6]),
            });
          } catch {}
        }
        setRealProjects(projects);
      } catch {}
    };
    fetchProjects();
  }, []);

  const VotingModal = ({ activity, onClose }: VotingModalProps) => {
    const [vote, setVote] = useState<"yes" | "no" | null>(null);
    const [comment, setComment] = useState("");
    const [showThankYou, setShowThankYou] = useState(false);

    const handleVoteSubmit = async () => {
      if (!vote) return;
      setVoteError(null);
      // If this is a real project (from contract), call voteProject
      const isRealProject = typeof activity.company === 'string' && activity.company.startsWith('0x');
      if (isRealProject) {
        setVoting(true);
        try {
          let address = walletAddress;
          if (!address) {
            address = await connectWallet();
            if (!address) throw new Error('Wallet not connected');
          }
          const ethWin = window as Window & { ethereum?: unknown };
          const client = createWalletClient({
            chain: qieTestnet,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            transport: custom(ethWin.ethereum as any),
          });
          const txHash = await client.writeContract({
            address: POI_CONTRACT_ADDRESS as `0x${string}`,
            abi: POI_ABI,
            functionName: 'voteProject',
            account: address as `0x${string}`,
            args: [BigInt(activity.id), vote === 'yes'],
          });
          setVoteTxHash(typeof txHash === 'string' ? txHash : String(txHash));
          setShowVoteSuccess(true);
        } catch (err: unknown) {
          setVoteError(err instanceof Error ? err.message : String(err));
        }
        setVoting(false);
      } else {
        // Dummy activity: just update local state
        setShowThankYou(true);
        if (vote === "yes") {
          handleVerification(activity.id);
        }
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    };

    return (
      <>
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" />
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative transform rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl"
            >
              {showVoteSuccess ? (
                <div className="p-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4"
                  >
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </motion.div>
                  <h3 className="text-2xl font-semibold text-gray-900">Your vote has been recorded on-chain</h3>
                  {voteTxHash && (
                    <div className="mt-2 text-green-700 text-xs break-all">
                      Tx: <a href={`https://testnet.qie.digital/tx/${voteTxHash}`} target="_blank" rel="noopener noreferrer">{voteTxHash}</a>
                    </div>
                  )}
                  <button
                    className="mt-6 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                    onClick={() => {
                      setShowVoteSuccess(false);
                      setVoteTxHash(null);
                      onClose();
                    }}
                  >Close</button>
                </div>
              ) : showThankYou ? (
                <div className="p-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4"
                  >
                    <ThumbsUp className="h-6 w-6 text-green-600" />
                  </motion.div>
                  <h3 className="text-2xl font-semibold text-gray-900">Thank You for Voting!</h3>
                  <p className="mt-2 text-gray-600">Your contribution helps maintain transparency in CSR activities.</p>
                </div>
              ) : (
                <>
                  <div className="absolute right-4 top-4">
                    <button
                      onClick={onClose}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">{activity.title}</h3>
                    <div className="space-y-4">
                      <p className="text-gray-600">{activity.fullDescription}</p>
                      
                      <div className="grid grid-cols-3 gap-4 my-4">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Calendar className="h-5 w-5" />
                          <span>{activity.dateRange}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <MapPin className="h-5 w-5" />
                          <span>{activity.location}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <IndianRupee className="h-5 w-5" />
                          <span>{activity.amount.toLocaleString('en-IN', { 
                            style: 'currency', 
                            currency: 'INR',
                            maximumFractionDigits: 0
                          })}</span>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="font-medium text-gray-900 mb-2">Proofs & Documentation</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="flex items-center space-x-2 text-gray-600 mb-2">
                              <Image className="h-5 w-5" />
                              <span>Photos/Videos</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              {activity.images.map((img, idx) => (
                                <img
                                  key={idx}
                                  src={img}
                                  alt={`Proof ${idx + 1}`}
                                  className="aspect-video object-cover rounded-lg"
                                />
                              ))}
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center space-x-2 text-gray-600 mb-2">
                              <FileText className="h-5 w-5" />
                              <span>Documents & Invoices</span>
                            </div>
                            <div className="space-y-2">
                              {activity.documents.map((doc, idx) => (
                                <div key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                                  <FileText className="h-4 w-4" />
                                  <span>{doc}</span>
                                </div>
                              ))}
                              {activity.invoiceDetails.map((invoice) => (
                                <div 
                                  key={invoice.id} 
                                  className="flex items-center justify-between text-sm p-1.5 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer transition-colors"
                                  onClick={() => {
                                    // Here you would typically open the invoice preview
                                    alert(`Opening Invoice ${invoice.id}: ${invoice.description} - ${invoice.amount.toLocaleString('en-IN', { 
                                      style: 'currency', 
                                      currency: 'INR',
                                      maximumFractionDigits: 0
                                    })}`);
                                  }}
                                >
                                  <div className="flex items-center space-x-2">
                                    <FileText className="h-4 w-4 text-gray-400" />
                                    <span className="text-gray-600">{invoice.description}</span>
                                  </div>
                                  <span className="text-gray-900 font-medium">
                                    {invoice.amount.toLocaleString('en-IN', { 
                                      style: 'currency', 
                                      currency: 'INR',
                                      maximumFractionDigits: 0
                                    })}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="font-medium text-gray-900 mb-4">Verify This Activity</h4>
                        <div className="space-y-4">
                          <div className="flex space-x-4">
                            <button
                              onClick={() => setVote("yes")}
                              className={`flex-1 flex items-center justify-center space-x-2 p-3 rounded-lg border ${
                                vote === "yes"
                                  ? "border-green-500 bg-green-50 text-green-700"
                                  : "border-gray-200 hover:bg-gray-50"
                              }`}
                            >
                              <ThumbsUp className="h-5 w-5" />
                              <span>Yes, this happened</span>
                            </button>
                            <button
                              onClick={() => setVote("no")}
                              className={`flex-1 flex items-center justify-center space-x-2 p-3 rounded-lg border ${
                                vote === "no"
                                  ? "border-red-500 bg-red-50 text-red-700"
                                  : "border-gray-200 hover:bg-gray-50"
                              }`}
                            >
                              <ThumbsDown className="h-5 w-5" />
                              <span>No, this seems incorrect</span>
                            </button>
                          </div>
                          
                          {vote === "no" && (
                            <textarea
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              placeholder="Please explain why you think this activity is incorrect..."
                              className="w-full p-3 border border-gray-200 rounded-lg"
                              rows={3}
                            />
                          )}
                          
                          <button
                            onClick={handleVoteSubmit}
                            disabled={!vote || voting}
                            className="w-full bg-black text-white p-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800"
                          >
                            {voting ? 'Submitting...' : 'Submit Vote'}
                          </button>
                          {voteError && (
                            <div className="text-red-600 text-sm mt-2">{voteError}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </>
    );
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)] pt-16">
        {/* Left Side - Box Reveal */}
        <div className="w-full md:w-[40%] p-8 md:p-12 flex items-start justify-center md:sticky md:top-16 h-fit">
        
            <div className="space-y-6 pt-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                You Witnessed the Impact — Now Verify It.
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Review real-world CSR initiatives carried out in your community. Check the evidence, and vote to confirm or reject the claims made.
              </p>
              <div className="flex items-center text-black font-medium">
                Verify Here <span className="ml-2">→</span>
              </div>
              <div className="pt-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">DAO Membership</h2>
                <button
                  onClick={handleCheckDaoMember}
                  className="bg-black text-white px-5 py-2 rounded-lg mb-2 shadow transition-transform transform hover:scale-105 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-black/50"
                  disabled={checkingDao}
                >
                  {checkingDao ? 'Checking...' : 'Check if you are DAO member'}
                </button>
                {isDaoMember === true && (
                  <div className="text-green-700 text-sm">You are a DAO member! You can vote below.</div>
                )}
                {isDaoMember === false && (
                  <div className="text-red-700 text-sm">You are not a DAO member. Voting is disabled.</div>
                )}
              </div>
            </div>
       
        </div>

        {/* Right Side - CSR Activity Cards */}
        <div className="w-full md:w-[60%] p-8 md:p-12 bg-gray-50">
          <div className="columns-1 md:columns-2 gap-6 space-y-6">
            {/* Show only first 4 dummy activities */}
            {activities.slice(0, 4).map((activity) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="break-inside-avoid"
              >
                <div
                  onClick={() => isDaoMember ? setSelectedActivity(activity) : null}
                  className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden ${!isDaoMember ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
                >
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-semibold text-gray-900">{activity.title}</h3>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        activity.status === "Verified" 
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {activity.status}
                      </span>
                    </div>
                    <p className="text-gray-600">{activity.description}</p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        {activity.date}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-2" />
                        {activity.beneficiary}
                      </div>
                    </div>
                    <button className="w-full mt-4 bg-black/5 hover:bg-black/10 text-black font-medium py-2 px-4 rounded-lg transition-colors" disabled={!isDaoMember}>
                      View & Vote
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
            {/* Real projects from contract */}
            {realProjects.map((project) => {
              // Map real project to dummy activity shape for VotingModal
              const mappedActivity = {
                id: project.id,
                title: project.title,
                description: project.description,
                fullDescription: project.description, // No fullDescription onchain, fallback
                beneficiary: project.company,
                date: '', // Not available
                dateRange: '', // Not available
                company: project.company,
                location: '', // Not available
                amount: project.amount,
                images: [], // Not available
                documents: [], // Not available
                invoiceDetails: [], // Not available
                status: project.status,
              };
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="break-inside-avoid"
                >
                  <div
                    onClick={() => isDaoMember ? setSelectedActivity(mappedActivity) : null}
                    className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden ${!isDaoMember ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
                  >
                    <div className="p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          project.status === "Approved" 
                            ? "bg-green-100 text-green-800"
                            : project.status === "Rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {project.status}
                        </span>
                      </div>
                      <p className="text-gray-600">{project.description}</p>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-2" />
                          {project.company}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="h-4 w-4 mr-2">💰</span>
                          {project.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
                        </div>
                      </div>
                      <button className="w-full mt-4 bg-black/5 hover:bg-black/10 text-black font-medium py-2 px-4 rounded-lg transition-colors" disabled={!isDaoMember}>
                        View & Vote
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedActivity && (
          <VotingModal
            activity={selectedActivity}
            onClose={() => setSelectedActivity(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
