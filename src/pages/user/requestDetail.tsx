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
  senderName: string;
  courseName: string;
  department: string;
  amount: bigint;
  status: number;
  note: string;
  submittedAt: bigint;
}

export const UserRequestDetailPage = ({ role, address }: Props) => {
  const { requestId } = useParams<{ requestId: string }>();
  const [request, setRequest] = useState<Request | null>(null);
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
        senderName: r.senderName,
        courseName: r.courseName,
        department: r.department,
        amount: r.amount,
        status: Number(r.status),
        note: r.note,
        submittedAt: r.submittedAt,
      });
    };

    fetchRequest();
  }, [requestId]);

  const handleCancel = async () => {
    if (!window.ethereum || !requestId) return;

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

    try {
      setTxStatus("Cancelling request...");
      const tx = await contract.cancelRequest(Number(requestId));
      await tx.wait();
      setTxStatus("Request cancelled successfully.");
      navigate(-1)
    } catch (err: unknown) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : "An unknown error occurred.";
      setTxStatus(`Failed to cancel the request. ${message}`);
    }
  };

  const statusText = ["Pending", "Approved", "Rejected", "Cancelled"][
    request?.status ?? 0
  ];

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
            <div>
              <span className="font-semibold">ผู้ส่ง (address):</span>{" "}
              {request.requester}
            </div>
            <div>
              <span className="font-semibold">ชื่อผู้ส่ง:</span>{" "}
              {request.senderName}
            </div>
            <div>
              <span className="font-semibold">แผนก:</span> {request.department}
            </div>
            <div>
              <span className="font-semibold">ชื่อคอร์ส:</span>{" "}
              {request.courseName}
            </div>
            <div>
              <span className="font-semibold">จำนวน:</span>{" "}
              {ethers.formatEther(request.amount)} ETH
            </div>
            <div>
              <span className="font-semibold">วันที่ส่งคำขอ:</span>{" "}
              {new Date(Number(request.submittedAt) * 1000).toLocaleString()}
            </div>
            <div>
              <span className="font-semibold">สถานะ:</span>{" "}
              <span
                className={`px-2 py-1 rounded-full text-sm font-medium ${
                  statusText === "Pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : statusText === "Approved"
                    ? "bg-green-100 text-green-700"
                    : statusText === "Rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-zinc-100 text-gray-800"
                }`}
              >
                {statusText}
              </span>
            </div>
            <div>
              <span className="font-semibold">หมายเหตุ:</span>{" "}
              {request.note || "-"}
            </div>

            {request.status === 0 && (
              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded cursor-pointer"
                >
                  ถอนคำขอ
                </button>
              </div>
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
