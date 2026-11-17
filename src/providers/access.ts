import type { AccessControlProvider } from "@refinedev/core";

// Only shapes what each role sees in the RMS; the API enforces the real permissions.
const ROLE_RESOURCES: Record<string, string[] | "all"> = {
  ADMIN: "all",
  MANAGER: ["dashboard", "categories", "products", "extras", "tables", "tabs", "orders"],
  WAITER: ["tabs"],
  KITCHEN: ["orders"],
};

const HOME: Record<string, string> = { WAITER: "/tabs", KITCHEN: "/orders" };

export function currentRole(): string | null {
  const identity = sessionStorage.getItem("refine-identity");
  return identity ? (JSON.parse(identity).role as string) : null;
}

export function homeFor(role: string | null): string {
  return (role && HOME[role]) || "/";
}

export function canSee(role: string | null, resource?: string): boolean {
  // unknown role or page: show it and let the API answer 401/403 (avoids a redirect loop)
  if (!resource || !role || !ROLE_RESOURCES[role]) return true;
  const allowed = ROLE_RESOURCES[role];
  return allowed === "all" || allowed.includes(resource);
}

export const accessControlProvider: AccessControlProvider = {
  can: async ({ resource }) => ({ can: canSee(currentRole(), resource) }),
  options: { queryOptions: { staleTime: 0, gcTime: 0 } },
};
