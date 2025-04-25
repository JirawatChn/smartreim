import { useState } from "react";
import { ethers } from "ethers";
import { MainLayout } from "../../component/mainlayout";
import contractABI from "../../abi/TrainingReimbursement.json";
import { CONTRACT_ADDRESS } from "../../contract/contract";

interface UserSendRequestPageProps {
  role: number | undefined;
  address: string | null;
}

const courseOptions = [
  "Blockchain Bootcamp",
  "React Developer Training",
  "Advanced Solidity",
  "Smart Contract Security",
  "Web3 Project Management",
];

const departmentOptions = ["IT", "HR", "Finance", "Marketing", "Operations"];

export const UserSendRequestPage = ({
  role,
  address,
}: UserSendRequestPageProps) => {
  const [senderName, setSenderName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [department, setDepartment] = useState("");
  const [amount, setAmount] = useState("");
  const [txStatus, setTxStatus] = useState("");

  const handleSubmit = async () => {
    if (!senderName || !courseName || !department || !amount) {
      return setTxStatus("Please fill in all fields");
    }

    try {
      if (!window.ethereum) return alert("Please install MetaMask");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractABI,
        signer
      );

      const weiAmount = BigInt(amount);
      const tx = await contract.submitRequest(
        senderName,
        courseName,
        department,
        weiAmount
      );

      setTxStatus("Sending request...");
      await tx.wait();
      setTxStatus("Request submitted successfully!");
      setSenderName("");
      setCourseName("");
      setDepartment("");
      setAmount("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
        setTxStatus("Error: " + err.message);
      } else {
        setTxStatus("Unknown error occurred");
      }
    }
  };

  return (
    <MainLayout
      headerText="Send Request | ส่งคำขอเบิกเงินค่าอบรม"
      role={role}
      address={address}
    >
      <p className="text-2xl font-bold mb-4">ส่งคำขอเบิกเงินค่าอบรม</p>

      <div className="max-w-md space-y-4 p-4 rounded shadow bg-white">
        <div>
          <label className="block mb-1 font-medium">ผู้ส่ง</label>
          <input
            type="text"
            value={address || "ไม่มีข้อมูล"}
            className="w-full  rounded p-2 bg-slate-100"
            placeholder="เช่น Jirawat Chanasit"
            disabled
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">ชื่อผู้ส่ง</label>
          <input
            type="text"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="เช่น Jirawat Chanasit"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">ชื่อคอร์ส</label>
          <select
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="">-- กรุณาเลือกคอร์ส --</option>
            {courseOptions.map((course, index) => (
              <option key={index} value={course}>
                {course}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">แผนก</label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="">-- กรุณาเลือกแผนก --</option>
            {departmentOptions.map((dep, index) => (
              <option key={index} value={dep}>
                {dep}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">จำนวน (wei)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="เช่น 100000"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="bg-slate-700 text-white px-4 py-2 rounded hover:bg-slate-500 cursor-pointer"
        >
          ส่งคำขอ
        </button>

        {txStatus && <p className="text-sm text-gray-700 mt-2">{txStatus}</p>}
      </div>
    </MainLayout>
  );
};
