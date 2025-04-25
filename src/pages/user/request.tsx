import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { MainLayout } from "../../component/mainlayout";
import contractABI from "../../abi/TrainingReimbursement.json";
import { CONTRACT_ADDRESS } from "../../contract/contract";

interface Request {
  requester: string;
  courseName: string;
  amount: bigint;
  status: number;
  note: string;
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

  useEffect(() => {
    const fetchMyRequests = async () => {
      if (!window.ethereum || !address) return;
  
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner(); 
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
  
      const rawIds = await contract.getMyRequests(); 
      const myRequestIds = rawIds.map((id: bigint) => Number(id));
    
    const myRequests: Request[] = await Promise.all(
      myRequestIds.map((id: number): Promise<Request> => contract.requests(id))
    );
  
      setRequests(myRequests);
    };
  
    fetchMyRequests();
  }, [address]);
  

  const table = (
    <div className="overflow-hidden rounded shadow">
      <table className="table-auto w-full">
        <thead className="bg-slate-800">
          <tr className="h-10 text-white text-sm">
            <th className="w-[10%] px-4 py-2 text-center">#</th>
            <th className="w-[30%] px-4 py-2 text-left">ชื่อคอร์ส</th>
            <th className="w-[20%] px-4 py-2 text-right">จำนวน (ETH)</th>
            <th className="w-[20%] px-4 py-2 text-center">สถานะ</th>
            <th className="w-[20%] px-4 py-2 text-center">หมายเหตุ</th>
          </tr>
        </thead>
        <tbody className="bg-slate-300 text-sm">
          {requests.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-4 text-center text-gray-500">
                ยังไม่มีคำขอ
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
                  <td className="px-4 py-2 text-center">{data.note || "-"}</td>
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
      <p className="text-2xl font-bold mb-4">คำขอของฉัน</p>
      {table}
    </MainLayout>
  );
};
