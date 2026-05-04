import { useEffect, useState } from "react";
import { getPaymentHistory } from "../../services/paymentService";
import { useNavigate } from "react-router-dom";
const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);

  const fetchData = async () => {
    const res = await getPaymentHistory();
    setPayments(res.data.data);
  };
  const navigate = useNavigate();
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Payment History</h1>

      {payments.map((p) => (
        <div key={p._id} className="bg-white p-4 shadow rounded flex justify-between">
          <div>
            <p className="font-medium">{p.borrow?.book?.title}</p>
            <p>₹{p.amount}</p>
            <p>Status: {p.status}</p>
          </div>
          <button onClick={() => navigate(-1)}>Back</button>
        </div>
      ))}
    </div>
  );
};

export default PaymentHistory;