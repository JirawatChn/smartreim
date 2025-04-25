import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ethers } from "ethers";
import { MainLayout } from "../../component/mainlayout";
import contractABI from "../../abi/TrainingReimbursement.json";
import { CONTRACT_ADDRESS } from "../../contract/contract";

interface Props {
  role: number | undefined;
  address: string | null;
}

interface Request {
  requester: string;
  courseName: string;
  amount: bigint;
  status: number;
  note: string;
}

export const AdminRequestDetailPage = ({ role, address }: Props) => {
  const { requestId } = useParams<{ requestId: string }>();
  const [request, setRequest] = useState<Request | null>(null);
  const [note, setNote] = useState("");
  const [txStatus, setTxStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequest = async () => {
      if (!window.ethereum || !requestId) return;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractABI,
        provider
      );

      const r = await contract.requests(Number(requestId));
      setRequest({
        requester: r.requester,
        courseName: r.courseName,
        amount: r.amount,
        status: Number(r.status),
        note: r.note,
      });
    };

    fetchRequest();
  }, [requestId]);

  const handleApprove = async () => {
    if (!window.ethereum || !requestId) return;

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

    try {
      setTxStatus("Approving request...");
      const tx = await contract.approveRequest(Number(requestId), note);
      await tx.wait();
      setTxStatus("Request approved successfully.");
    } catch (err: unknown) {
      const message = err instanceof Error && err.message ? err.message : "";
      if (message.includes("Not enough balance in contract")) {
        setTxStatus("Not enough balance in contract.");
      } else {
        setTxStatus("Failed to approve the request.");
      }
    }
  };

  const handleReject = async () => {
    if (!window.ethereum || !requestId) return;

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

    try {
      setTxStatus("Rejecting request...");
      const tx = await contract.rejectRequest(Number(requestId), note);
      await tx.wait();
      setTxStatus("Request rejected successfully.");
    } catch (err: unknown) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : "An unknown error occurred.";
      setTxStatus(`Failed to reject the request. ${message}`);
    }
  };

  const statusText = ["Pending", "Approved", "Rejected"][request?.status ?? 0];

  return (
    <MainLayout
      headerText="Requests | รายละเอียดคำขอ"
      role={role}
      address={address}
    >
      <button
        type="button"
        className="border border-gray-500 px-4 py-1 rounded text-gray-700 cursor-pointer hover:bg-gray-100 transition mb-3"
        onClick={() => {
          navigate(-1);
        }}
      >
        ย้อนกลับ
      </button>

      <p className="text-2xl font-bold mb-4">รายละเอียดคำขอรหัส {requestId}</p>
      <div className="bg-white p-4 shadow-sm rounded">
        {request ? (
          <div className="space-y-4 text-base">
            <div>ผู้ส่ง: {request.requester}</div>
            <div>ชื่อคอร์ส: {request.courseName}</div>
            <div>จำนวน: {ethers.formatEther(request.amount)} ETH</div>
            <div>
              สถานะ:{" "}
              <span
                className={`px-2 py-1 rounded-full text-sm font-medium
      ${
        statusText === "Pending"
          ? "bg-yellow-100 text-yellow-800"
          : statusText === "Approved"
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
              >
                {statusText}
              </span>
            </div>

            <div>หมายเหตุ: {request.note || "-"}</div>

            {request.status === 0 && (
              <>
                <textarea
                  className="w-full p-2 border rounded"
                  rows={3}
                  placeholder="ใส่หมายเหตุ"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />

                <div className="flex gap-3">
                  <button
                    onClick={handleApprove}
                    className="bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded cursor-pointer"
                  >
                    อนุมัติ
                  </button>
                  <button
                    onClick={handleReject}
                    className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded cursor-pointer"
                  >
                    ปฏิเสธ
                  </button>
                </div>
              </>
            )}

            {txStatus && <p className="mt-2 text-gray-700">{txStatus}</p>}
          </div>
        ) : (
          <p>กำลังโหลดข้อมูล...</p>
        )}
      </div>
    </MainLayout>
  );
};
