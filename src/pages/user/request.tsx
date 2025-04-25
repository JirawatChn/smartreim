import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { MainLayout } from "../../component/mainlayout";
import contractABI from "../../abi/TrainingReimbursement.json";
import { CONTRACT_ADDRESS } from "../../contract/contract";
import { Link } from "react-router-dom";

interface Request {
  requester: string;
  senderName: string;
  courseName: string;
  department: string;
  amount: bigint;
  status: number;
  note: string;
  submittedAt: bigint;
  id: number;
}
interface UserMyRequestsPageProps {
  role: number | undefined;
  address: string | null;
}

export const UserMyRequestsPage = ({
  role,
  address,
}: UserMyRequestsPageProps) => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [filter, setFilter] = useState<"all" | "pending">("pending");

  useEffect(() => {
    const fetchMyRequests = async () => {
      if (!window.ethereum || !address) return;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractABI,
        signer
      );

      const rawIds = await contract.getMyRequests();
      const myRequestIds = rawIds.map((id: bigint) => Number(id));

      const myRequests: Request[] = await Promise.all(
        myRequestIds.map(async (id: number): Promise<Request> => {
          const r = await contract.requests(id);
          return {
            id,
            requester: r.requester,
            senderName: r.senderName,
            courseName: r.courseName,
            department: r.department,
            amount: r.amount,
            status: Number(r.status),
            note: r.note,
            submittedAt: r.submittedAt,
          };
        })
      );

      setRequests(myRequests);
    };

    fetchMyRequests();
  }, [address]);

  const filteredRequests = [...requests]
    .filter((r) => (filter === "pending" ? r.status === 0 : true))
    .sort((a, b) => a.status - b.status);

  const table = (
    <div className="overflow-hidden rounded shadow">
      <table className="table-auto w-full">
        <thead className="bg-slate-800">
          <tr className="h-10 text-white text-sm">
            <th className="w-[5%] px-4 py-2 text-center">#</th>
            <th className="w-[20%] px-4 py-2 text-left">ชื่อคอร์ส</th>
            <th className="w-[15%] px-4 py-2 text-right">จำนวน (ETH)</th>
            <th className="w-[15%] px-4 py-2 text-center">สถานะ</th>
            <th className="w-[15%] px-4 py-2 text-center">หมายเหตุ</th>
            <th className="w-[10%] px-4 py-2 text-center"></th>
          </tr>
        </thead>

        <tbody className="bg-slate-300 text-sm">
          {filteredRequests.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-4 text-center text-gray-500">
                ยังไม่มีคำขอ
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
                <tr key={i} className="h-12 border-b border-slate-300">
                  <td className="px-4 py-2 text-center">{i + 1}</td>
                  <td className="px-4 py-2">{data.courseName}</td>
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
                  <td className="px-4 py-2 text-center">{data.note || "-"}</td>
                  <td className="px-4 py-2 text-center underline text-slate-600">
                    <Link to={`/user/requests/${data.id}`}>เปิด</Link>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <MainLayout
      headerText="My Request | คำขอของฉัน"
      role={role}
      address={address}
    >
      <div className="flex justify-between items-center mb-4">
        <p className="text-2xl font-bold">คำขอของฉัน</p>
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
      {table}
    </MainLayout>
  );
};
