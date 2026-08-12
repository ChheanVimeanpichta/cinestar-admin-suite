import { useEffect, useState } from "react";
import { Users2 } from "lucide-react";
import { UserProfile } from "../../types";
import { fetchAllUsers } from "../../services/api";
import Card from "../../components/shared/Card";
import Badge from "../../components/shared/Badge";

export default function Users() {
  const [users, setUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    fetchAllUsers().then(setUsers);
  }, []);

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="flex items-center gap-3 font-heading font-black text-4xl uppercase text-onSurface">
            <Users2 size={30} className="text-accent" />
            Users
          </h1>
          <p className="text-onSurfaceVariant text-body-md mt-2 max-w-xl">
            Manage platform accounts
          </p>
        </div>
      </div>
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