"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Helper to shorten address
  const shortAddress = (addr: string) =>
    addr.slice(0, 6) + "..." + addr.slice(-4);

  // ✅ QIE Testnet params (OFFICIAL)
  const qieChainParams = {
    chainId: "0x7BF", // 1983 in hex
    chainName: "QIE Testnet",
    nativeCurrency: {
      name: "QIE",
      symbol: "QIE",
      decimals: 18,
    },
    rpcUrls: ["https://rpc1testnet.qie.digital/"],
    blockExplorerUrls: ["https://testnet.qie.digital/"],
  };

  const connectWallet = async () => {
    setConnecting(true);

    try {
      const ethWin = window as Window & {
        ethereum?: {
          request: (args: {
            method: string;
            params?: unknown[];
          }) => Promise<unknown>;
        };
      };

      if (!ethWin.ethereum) {
        alert("QIE Wallet not detected. Please install QIE Wallet.");
        setConnecting(false);
        return;
      }

      // 1️⃣ Request wallet accounts
      const accounts = (await ethWin.ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];

      setWalletAddress(accounts[0]);

      // 2️⃣ Check current chain
      const currentChainId = (await ethWin.ethereum.request({
        method: "eth_chainId",
      })) as string;

      // 3️⃣ Switch to QIE Testnet if needed
      if (currentChainId !== qieChainParams.chainId) {
        try {
          await ethWin.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: qieChainParams.chainId }],
          });
        } catch (switchError: unknown) {
          // If QIE Testnet is not added, add it
          if (typeof switchError === 'object' && switchError && 'code' in switchError && (switchError as { code: number }).code === 4902) {
            await ethWin.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [qieChainParams],
            });
          } else {
            alert("Failed to switch to QIE Testnet");
          }
        }
      }
    } catch (error) {
      console.error(error);
      alert("Wallet connection failed");
    }

    setConnecting(false);
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setDropdownOpen(false);
  };

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-white/90 backdrop-blur-md shadow-xl rounded-3xl border border-gray-200 px-4 py-2 max-w-5xl mx-auto flex items-center w-[95vw]">
      <div className="flex justify-between items-center w-full">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-black text-gray-900 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-100 to-white shadow-sm"
        >
          POI
        </Link>

        {/* Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/show-poi" className="nav-btn">Show POI</Link>
          <Link href="/verify-poi" className="nav-btn">Verify POI</Link>
          <Link href="/" className="nav-btn">Profile</Link>
          <Link href="/" className="nav-btn">About</Link>
        </div>

        {/* Wallet */}
        <div className="relative" ref={dropdownRef}>
          {walletAddress ? (
            <>
              <button
                className="px-4 py-2 rounded-full bg-indigo-50 font-mono text-sm"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {shortAddress(walletAddress)}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg">
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={disconnectWallet}
                  >
                    Disconnect
                  </button>
                </div>
              )}
            </>
          ) : (
            <Button onClick={connectWallet} disabled={connecting}>
              {connecting ? "Connecting..." : "Connect Wallet"}
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
