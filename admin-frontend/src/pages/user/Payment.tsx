import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PaymentMethod } from "../../types";
import Card from "../../components/shared/Card";
import Button from "../../components/shared/Button";
import SectionHeader from "../../components/shared/SectionHeader";

const methods: PaymentMethod[] = ["ABA", "ACLEDA", "WING"];

export default function Payment() {
  const navigate = useNavigate();
  const [method, setMethod] = useState<PaymentMethod>("ABA");

  const confirmPayment = () => {
    // TODO: call bookingApi.confirmBooking(screeningId, method)
    navigate("/profile/history");
  };

  return (
    <div className="px-12 py-12 flex flex-col items-center">
      <SectionHeader title="Scan to Pay" subtitle="Verify your payment using a local method" />

      <div className="flex gap-3 mb-8">
        {methods.map((m) => (
          <button
            key={m}
            onClick={() => setMethod(m)}
            className={`px-5 py-2 rounded font-mono text-label-mono transition-all ${
              method === m ? "bg-accent text-onSurface" : "bg-surface-variant text-onSurfaceVariant"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <Card glass className="flex flex-col items-center gap-4 w-80">
        {/* QR placeholder - replace with generated QR image per method/screeningId */}
        <div className="w-48 h-48 bg-white rounded flex items-center justify-center text-surface font-mono text-xs">
          QR CODE ({method})
        </div>
        <p className="text-onSurfaceVariant text-sm text-center">
          Scan with your {method} mobile app to complete the transaction.
        </p>
        <Button className="w-full" onClick={confirmPayment}>
          I've Completed Payment
        </Button>
      </Card>
    </div>
  );
}