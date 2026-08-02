import { useEffect, useState } from "react";
import { UserProfile } from "../../types";
import { fetchCurrentUser } from "../../services/api";
import SectionHeader from "../../components/shared/SectionHeader";
import Card from "../../components/shared/Card";
import { Link } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetchCurrentUser().then(setUser);
  }, []);

  return (
    <div className="px-12 py-12">
      <SectionHeader title="My Profile" subtitle="Manage your account and tickets" />
      {user && (
        <Card glass className="max-w-md flex items-center gap-4">
          <img
            src={user.avatarUrl ?? "/default-avatar.png"}
            className="w-16 h-16 rounded-full object-cover"
            alt={user.name}
          />
          <div>
            <p className="font-heading text-onSurface text-lg">{user.name}</p>
            <p className="text-onSurfaceVariant text-sm">{user.email}</p>
          </div>
        </Card>
      )}
      <Link to="/profile/history" className="text-accent hover:underline mt-6 inline-block">
        View Booking History →
      </Link>
    </div>
  );
}