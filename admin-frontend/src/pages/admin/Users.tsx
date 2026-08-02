import { useEffect, useState } from "react";
import { UserProfile } from "../../types";
import { fetchAllUsers } from "../../services/api";
import Card from "../../components/shared/Card";
import SectionHeader from "../../components/shared/SectionHeader";
import Badge from "../../components/shared/Badge";

export default function Users() {
  const [users, setUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    fetchAllUsers().then(setUsers);
  }, []);

  return (
    <div>
      <SectionHeader title="Users" subtitle="Manage platform accounts" />
      <div className="grid gap-3">
        {users.map((u) => (
          <Card key={u.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={u.avatarUrl ?? "/default-avatar.png"} className="w-10 h-10 rounded-full" alt={u.name} />
              <div>
                <p className="text-onSurface font-heading">{u.name}</p>
                <p className="text-onSurfaceVariant text-sm">{u.email}</p>
              </div>
            </div>
            <Badge label={u.role} tone={u.role === "admin" ? "accent" : "neutral"} />
          </Card>
        ))}
      </div>
    </div>
  );
}