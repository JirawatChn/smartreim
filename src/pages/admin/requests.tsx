import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import contractABI from "../../abi/TrainingReimbursement.json";
import { MainLayout } from "../../component/mainlayout";
import { CONTRACT_ADDRESS } from "../../contract/contract";

interface Request {
  id: number;
  requester: string;
  senderName: string;
  department: string;
  courseName: string;
  amount: bigint;
  status: number;
  note: string;
}

interface AdminRequestsPageProps {
  role: number | undefined;
  address: string | null;
}

export const AdminRequestsPage = ({
  role,
  address,
}: AdminRequestsPageProps) => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [filter, setFilter] = useState<"all" | "pending">("pending");

  useEffect(() => {
    const fetchRequests = async () => {
      if (!window.ethereum) return;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractABI,
        provider
      );

      const count: bigint = await contract.requestCount();

      const list: Request[] = [];
      for (let i = 0; i < Number(count); i++) {
        const r = await contract.requests(i);
        list.push({
          id: i,
          requester: r.requester,
          senderName: r.senderName,
          department: r.department,
          courseName: r.courseName,
          amount: r.amount,
          status: Number(r.status),
          note: r.note,
        });
      }

      setRequests(list);
    };

    fetchRequests();
  }, []);

  const filteredRequests = [...requests]
    .filter((r) => (filter === "pending" ? r.status === 0 : true))
    .sort((a, b) => a.status - b.status);

  return (
    <MainLayout
      headerText="Requests | คำขอเบิกเงินทั้งหมด"
      role={role}
      address={address}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-2xl font-bold">คำขอเบิกเงินทั้งหมด</p>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("pending")}
            className={`px-3 py-1 rounded border cursor-pointer ${
              filter === "pending"
                ? "bg-slate-800 hover:bg-slate-700 text-white"
                : "bg-white text-slate-800 hover:bg-slate-100 border-slate-400"
            }`}
          >
            เฉพาะรอดำเนินการ
          </button>
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded border cursor-pointer ${
              filter === "all"
                ? "bg-slate-800 hover:bg-slate-700 text-white"
                : "bg-white text-slate-800 hover:bg-slate-100 border-slate-400"
            }`}
          >
            ดูทั้งหมด
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded shadow">
        <table className="table-auto w-full">
          <thead className="bg-slate-800">
            <tr className="h-10 text-white text-sm">
              <th className="w-[5%] px-4 py-2 text-center">#</th>
              <th className="w-[20%] px-4 py-2 text-left">ชื่อผู้ส่ง</th>
              <th className="w-[20%] px-4 py-2 text-left">แผนก</th>
              <th className="w-[25%] px-4 py-2 text-left">ชื่อคอร์ส</th>
              <th className="w-[15%] px-4 py-2 text-right">จำนวน (ETH)</th>
              <th className="w-[10%] px-4 py-2 text-center">สถานะ</th>
              <th className="w-[5%] px-4 py-2 text-center"></th>
            </tr>
          </thead>
          <tbody className="bg-slate-300 text-sm">
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-4 text-center text-gray-500">
                  ไม่มีคำขอ
                </td>
              </tr>
            ) : (
              filteredRequests.map((data, i) => {
                const statusText = [
                  "Pending",
                  "Approved",
                  "Rejected",
                  "Cancelled",
                ][data.status];
                const statusColor = {
                  Pending: "bg-yellow-100 text-yellow-800",
                  Approved: "bg-green-100 text-green-700",
                  Rejected: "bg-red-100 text-red-700",
                  Cancelled: "bg-zinc-100 text-gray-800",
                }[statusText];

                return (
                  <tr key={data.id} className="h-12 border-b border-slate-300">
                    <td className="px-4 py-2 text-center">{i + 1}</td>
                    <td className="px-4 py-2 text-left">{data.senderName}</td>
                    <td className="px-4 py-2 text-left">{data.department}</td>
                    <td className="px-4 py-2 text-left">{data.courseName}</td>
                    <td className="px-4 py-2 text-right">
                      {ethers.formatEther(data.amount)} ETH
                    </td>
                    <td className="px-4 py-2 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}
                      >
                        {statusText}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-center underline text-slate-600">
                      <Link to={`/admin/requests/${data.id}`}>เปิด</Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
};
