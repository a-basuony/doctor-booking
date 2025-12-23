import { FaApplePay, FaCcVisa, FaPaypal } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

type Props = {
  onPay: () => void;
};

export default function PaymentCard({ onPay }: Props) {
  const navigate = useNavigate();
  return (
    
    <div  onClick={() => navigate("/payment")}
     className="border border-gray-400 rounded-3xl shadow-sm bg-white overflow-hidden m-5">
      <div className="h-64 px-8 py-6 flex flex-col gap-4">
        {[FaApplePay, FaCcVisa, FaPaypal].map((Icon, i) => (
          <button
            key={i}
            onClick={onPay}
            className="flex items-center gap-3 border rounded-xl px-4 py-3 shadow-sm"
          >
            <Icon className="w-6 h-6 text-[#145db8]" />
            <span className="text-sm">Secure payment option</span>
          </button>
        ))}
      </div>

      <div className="px-7 py-6 shadow-[0_-4px_10px_rgba(0,0,0,0.12)]">
        <h3 className="text-xl font-serif mb-2">Book & Pay Online</h3>
        <p className="text-sm text-gray-600">
          Pay securely using multiple options.
        </p>
      </div>
    </div>
  );
}