import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { MainLayout } from "../../component/mainlayout";
import contractABI from "../../abi/TrainingReimbursement.json";
import { CONTRACT_ADDRESS } from "../../contract/contract";

interface AdminDashboardPageProps {
  role: number | undefined;
  address: string | null;
}

export const AdminDashboardPage = ({
  role,
  address,
}: AdminDashboardPageProps) => {
  const [requestCount, setRequestCount] = useState(0);
  const [pending, setPending] = useState(0);
  const [approved, setApproved] = useState(0);
  const [rejected, setRejected] = useState(0);
  const [totalAmount, setTotalAmount] = useState("0");

  useEffect(() => {
    const fetchRequestStats = async () => {
      if (!window.ethereum) return;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractABI,
        provider
      );

      const count: bigint = await contract.requestCount();
      setRequestCount(Number(count));

      let pendingCount = 0;
      let approvedCount = 0;
      let rejectedCount = 0;
      let total = BigInt(0);

      for (let i = 0; i < Number(count); i++) {
        const r = await contract.requests(i);
        total += r.amount;
        const status = Number(r.status);
        if (status === 0) pendingCount++;
        if (status === 1) approvedCount++;
        if (status === 2) rejectedCount++;
      }

      setPending(pendingCount);
      setApproved(approvedCount);
      setRejected(rejectedCount);
      setTotalAmount(ethers.formatEther(total));
    };

    fetchRequestStats();
  }, []);

  return (
    <MainLayout headerText="แดชบอร์ด" role={role} address={address}>
      <div className="text-xl mb-6">ยินดีต้อนรับเข้าสู่ Smart Reim (Admin)</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500 text-sm mb-1">ที่รอดำเนินการ</p>
          <p className="text-3xl font-bold text-yellow-600">{pending}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500 text-sm mb-1">ที่อนุมัติแล้ว</p>
          <p className="text-3xl font-bold text-green-600">{approved}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500 text-sm mb-1">ที่ถูกปฏิเสธ</p>
          <p className="text-3xl font-bold text-red-600">{rejected}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500 text-sm mb-1">จำนวนคำขอทั้งหมด</p>
          <p className="text-3xl font-bold text-slate-800">{requestCount}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500 text-sm mb-1">จำนวนเงินที่ขอเบิกรวม</p>
          <p className="text-2xl font-semibold text-slate-800">
            {totalAmount} ETH
          </p>
        </div>
      </div>
    </MainLayout>
  );
};
