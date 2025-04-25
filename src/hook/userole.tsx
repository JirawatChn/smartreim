import { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractABI from "../abi/TrainingReimbursement.json";

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };
  }
}

const contractAddress = "0x49D542CD4aB909eF162b95F635F065FCBAEBd3b3";

export const useRole = (address: string | null) => {
  const [role, setRole] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRole = async () => {
      if (!address || !window.ethereum) return;
      setIsLoading(true);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      const roleValue = await contract.roles(address);
      setRole(Number(roleValue));

      setIsLoading(false);
    };

    fetchRole();
  }, [address]);

  return { role, isLoading };
};
