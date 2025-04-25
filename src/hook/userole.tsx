import { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractABI from "../abi/TrainingReimbursement.json";
import { CONTRACT_ADDRESS } from "../contract/contract";

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };
  }
}

export const useRole = (address: string | null) => {
  const [role, setRole] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRole = async () => {
      if (!address || !window.ethereum) return;
      setIsLoading(true);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);
      const roleValue = await contract.roles(address);
      setRole(Number(roleValue));

      setIsLoading(false);
    };

    fetchRole();
  }, [address]);

  return { role, isLoading };
};
