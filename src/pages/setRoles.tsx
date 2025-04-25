import { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractABI from "../abi/TrainingReimbursement.json";
import { MainLayout } from "../component/mainlayout";
import { CONTRACT_ADDRESS } from "../contract/contract";

interface SetRolesPageProps {
  role: number | undefined;
  address: string | null;
}

export const SetRolesPage = ({ role, address }: SetRolesPageProps) => {
  const [selectedRole, setSelectedRole] = useState<number>(1);
  const [txStatus, setTxStatus] = useState<string>("");

  useEffect(() => {
    if (role !== undefined) {
      setSelectedRole(role);
    }
  }, [role]);

  const handleSetRole = async () => {
    try {
      if (!window.ethereum) return alert("Please install MetaMask");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractABI,
        signer
      );

      const tx = await contract.setRole(selectedRole);
      setTxStatus("Sending transaction...");

      await tx.wait();
      setTxStatus("Role updated successfully!");
      window.location.reload();
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
        setTxStatus("Error: " + err.message);
      } else {
        console.error("Unexpected error", err);
        setTxStatus("Error: Something went wrong");
      }
    }
  };

  return (
    <MainLayout
      headerText="Set Roles | เปลี่ยนสิทธิ์การใช้งาน"
      role={role}
      address={address}
    >
      <div className="max-w-md p-4 rounded shadow bg-white">
        <label className="block mb-2 font-medium">
          เลือก Role ที่ต้องการตั้ง:
        </label>
        <select
          className="border p-2 rounded w-full mb-4"
          value={selectedRole}
          onChange={(e) => setSelectedRole(Number(e.target.value))}
        >
          <option value={1}>User</option>
          <option value={2}>Admin</option>
        </select>

        <button
          onClick={handleSetRole}
          className="bg-slate-700 text-white px-4 py-2 rounded hover:bg-slate-500 cursor-pointer"
        >
          Set Role
        </button>

        {txStatus && <p className="mt-4 text-sm text-gray-700">{txStatus}</p>}
      </div>
    </MainLayout>
  );
};
