import { apiGet, apiPost } from "./api";
import { UserProfile } from "../types";

export function getUsers(): Promise<UserProfile[]> {
  return apiGet<UserProfile[]>("/users");
}

export function updateUserPermissions(
  userId: string,
  permissions: Partial<UserProfile>
): Promise<UserProfile> {
  return apiPost<UserProfile>(`/users/${userId}`, permissions);
}
