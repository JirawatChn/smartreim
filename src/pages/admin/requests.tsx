import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import contractABI from "../../abi/TrainingReimbursement.json";
import { MainLayout } from "../../component/mainlayout";

const contractAddress = "0x49D542CD4aB909eF162b95F635F065FCBAEBd3b3";

interface Request {
  requester: string;
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

  useEffect(() => {
    const fetchRequests = async () => {
      if (!window.ethereum) return;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        provider
      );

      const count: bigint = await contract.requestCount(); // ดึงจำนวนทั้งหมด

      const requestList: Request[] = [];
      for (let i = 0; i < Number(count); i++) {
        const r = await contract.requests(i);
        requestList.push({
          requester: r.requester,
          courseName: r.courseName,
          amount: r.amount,
          status: Number(r.status), // แปลงให้แน่ใจ
          note: r.note,
        });
      }

      setRequests(requestList);
    };

    fetchRequests();
  }, []);

  const table = (
    <div className="overflow-hidden rounded shadow">
      <table className="table-auto w-full">
        <thead className="bg-slate-800">
          <tr className="h-10 text-white text-sm">
            <th className="w-[10%] px-4 py-2 text-center">#</th>
            <th className="w-[25%] px-4 py-2 text-left">ผู้ส่ง</th>
            <th className="w-[25%] px-4 py-2 text-left">ชื่อคอร์ส</th>
            <th className="w-[15%] px-4 py-2 text-right">จำนวน (ETH)</th>
            <th className="w-[15%] px-4 py-2 text-center">สถานะ</th>
            <th className="w-[10%] px-4 py-2 text-center"></th>
          </tr>
        </thead>
        <tbody className="bg-slate-300 text-sm">
          {requests.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-4 text-center text-gray-500">
                ไม่มีคำขอ
              </td>
            </tr>
          ) : (
            requests.map((data, i) => {
              const statusText = ["Pending", "Approved", "Rejected"][
                data.status
              ];
              const statusColor = {
                Pending: "bg-yellow-100 text-yellow-800",
                Approved: "bg-green-100 text-green-700",
                Rejected: "bg-red-100 text-red-700",
              }[statusText];

              return (
                <tr key={i} className="h-12 border-b border-slate-300">
                  <td className="px-4 py-2 text-center">{i + 1}</td>
                  <td className="px-4 py-2 text-left">{data.requester}</td>
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
                    <Link to={`/admin/requests/${i}`}>เปิด</Link>
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
      headerText="Requests | คำขอเบิกเงินทั้งหมด"
      role={role}
      address={address}
    >
      <p className="text-2xl font-bold mb-4">คำขอเบิกเงินทั้งหมด</p>
      {table}
    </MainLayout>
  );
};
