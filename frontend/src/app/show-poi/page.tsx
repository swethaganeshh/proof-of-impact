"use client";

import Navbar from "@/components/navbar";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { uploadFileToPinata } from "@/lib/pinata";
import { POI_CONTRACT_ADDRESS, POI_ABI } from "@/abi";
import { createWalletClient, custom } from 'viem';
import { qieTestnet } from '@/lib/qie-chain';

export default function ShowPOIPage() {
  const router = useRouter();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [amount, setAmount] = useState("");
  const [beneficiary, setBeneficiary] = useState("");
  const [invoices, setInvoices] = useState<FileList | null>(null);
  const [photos, setPhotos] = useState<FileList | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const pinataApiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY || "";
  const pinataApiSecret = process.env.NEXT_PUBLIC_PINATA_API_SECRET || "";
  const [invoiceLinks, setInvoiceLinks] = useState<string[]>([]);
  const [photoLinks, setPhotoLinks] = useState<string[]>([]);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

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

  const isFormValid = () => {
    return (
      title.trim() !== "" &&
      description.trim() !== "" &&
      beneficiary.trim() !== "" &&
      startDate !== "" &&
      endDate !== "" &&
      location.trim() !== "" &&
      amount !== "" &&
      invoices?.length &&
      photos?.length
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;
    let address = walletAddress;
    if (!address) {
      address = await connectWallet();
      if (!address) return;
    }
    const invoiceHash = invoiceLinks[0]?.replace("https://gateway.pinata.cloud/ipfs/", "") || "";
    const mediaHash = photoLinks[0]?.replace("https://gateway.pinata.cloud/ipfs/", "") || "";
    try {
      const ethWin = window as Window & { ethereum?: unknown };
      const client = createWalletClient({
        chain: qieTestnet,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        transport: custom(ethWin.ethereum as any),
      });
      const hash = await client.writeContract({
        address: POI_CONTRACT_ADDRESS as `0x${string}`,
        abi: POI_ABI,
        functionName: "submitProject",
        account: address as `0x${string}`,
        args: [
          title,
          description,
          BigInt(Math.floor(new Date(startDate).getTime() / 1000)),
          BigInt(Math.floor(new Date(endDate).getTime() / 1000)),
          location,
          BigInt(amount),
          invoiceHash,
          mediaHash,
          beneficiary,
        ],
      });
      setTxHash(hash);
      setShowSuccess(true);
      setModalOpen(true);
      setTimeout(() => router.push("/verify-poi"), 1500);

    } catch (err: unknown) {
      alert("Error submitting project: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleInvoicesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setInvoices(files);
    if (!files) return;
    const links: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const res = await uploadFileToPinata(file, pinataApiKey, pinataApiSecret);
      const url = `https://gateway.pinata.cloud/ipfs/${res.IpfsHash}`;
      links.push(url);
    }
    setInvoiceLinks(links);
  };

  const handlePhotosChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setPhotos(files);
    if (!files) return;
    const links: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const res = await uploadFileToPinata(file, pinataApiKey, pinataApiSecret);
      const url = `https://gateway.pinata.cloud/ipfs/${res.IpfsHash}`;
      links.push(url);
    }
    setPhotoLinks(links);
  };
  // 🔽 ONLY LOGIC FIXES – UI UNCHANGED




  return (
    <main className="min-h-screen bg-white relative">
      <Navbar />
      <AnimatePresence>
        {showSuccess && (
          <>
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-8 z-50 w-[90%] max-w-md"
            >
              <button
                onClick={() => router.push("/")}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="flex flex-col items-center text-center space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <CheckCircle2 className="w-16 h-16 text-green-500" />
                </motion.div>
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-gray-900"
                >
                  CSR Activity Attested On-Chain
                </motion.h2>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-600"
                >
                  Your impact has been successfully recorded
                </motion.p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)] pt-16">
        {/* Left Side - Box Reveal */}
        <div className="w-full md:w-[40%] p-8 md:p-12 flex items-start justify-center md:sticky md:top-16 h-fit">
         
            <div className="space-y-6 pt-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Prove Your Impact. Build Public Trust.
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Put your CSR claims under the spotlight. Upload real-world proof and let the people validate your impact — not just paperwork.
              </p>
              <div className="flex items-center text-black font-medium">
                Fill Here <span className="ml-2">→</span>
              </div>
            </div>
          
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-[60%] p-8 md:p-12 bg-gray-50">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-8">
                From Action to Proof — Make It Count
              </h2>
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Project Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Project Description
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="beneficiary" className="block text-sm font-medium text-gray-700 mb-1">
                    Beneficiary
                  </label>
                  <input
                    type="text"
                    id="beneficiary"
                    value={beneficiary}
                    onChange={(e) => setBeneficiary(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                    required
                    
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                    Amount Spent
                  </label>
                  <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="invoices" className="block text-sm font-medium text-gray-700 mb-1">
                    Invoices / Financial Proof
                  </label>
                  <input
                    type="file"
                    id="invoices"
                    onChange={handleInvoicesChange}
                    multiple
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
                    required
                  />
                  {invoiceLinks.length > 0 && (
                    <div className="mt-2 text-xs text-blue-700 space-y-1">
                      {invoiceLinks.map((link, idx) => (
                        <div key={idx} className="truncate">
                          <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="photos" className="block text-sm font-medium text-gray-700 mb-1">
                    Photos / Media Proof
                  </label>
                  <input
                    type="file"
                    id="photos"
                    onChange={handlePhotosChange}
                    multiple
                    accept="image/*,video/*"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
                    required
                  />
                  {photoLinks.length > 0 && (
                    <div className="mt-2 text-xs text-blue-700 space-y-1">
                      {photoLinks.map((link, idx) => (
                        <div key={idx} className="truncate">
                          <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!isFormValid()}
                  className="w-full bg-black text-white py-3 px-6 rounded-md transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 disabled:hover:bg-black"
                >
                  Submit Proof
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for transaction status */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
          >
            <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
              <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
              <h2 className="text-xl font-bold mb-2">Transaction Submitted</h2>
              {txHash && (
                <div className="text-xs text-green-700 mb-2">Tx: <a href={`https://testnet.qie.digital/tx/${txHash}`} target="_blank" rel="noopener noreferrer">{txHash}</a></div>
              )}
              <div className="text-gray-700 mb-4">Your CSR activity has been attested on-chain!</div>
              <button onClick={() => setModalOpen(false)} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">Close</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
