import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface LoginPageProps {
  onConnect: () => Promise<void>;
  address: string | null;
  role?: number;
}

export const LoginPage = ({ onConnect, address, role }: LoginPageProps) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (address && role !== undefined) {
      if (role === 2) navigate("/admin/dashboard");
      else if (role === 1 || role === 0) navigate("/user/dashboard");
    }
  }, [address, role, navigate]);
  return (
    <div className="flex flex-col items-center mt-10">
      <p className="text-3xl font-bold ">Smart Reim</p>
      <p className="text-xl font-bold mb-4">ระบบเบิกเงินค่าอบรม</p>
      <p className="mb-3">โปรดเชื่อมต่อกับ Metamask ก่อนเข้าสู่หน้าเว็บไซด์</p>
      <button
        onClick={() => onConnect()}
        className="bg-slate-700 hover:bg-slate-500 text-white font-bold p-2 rounded-sm cursor-pointer"
      >
        Connect Wallet
      </button>
    </div>
  );
};
