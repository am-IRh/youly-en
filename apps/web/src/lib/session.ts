import "server-only";
import { env } from "@youly-en/env/web";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

type ServerSession = {
  user: {
    id: string;
    name: string;
    role: "user" | "admin";
    phoneNumber?: string | null;
    phoneNumberVerified?: boolean;
    createdAt: string;
  };
  session: { id: string; expiresAt: string };
};

// cache(): one backend call per request, even if several components ask for the session
export const getServerSession = cache(async (): Promise<ServerSession | null> => {
  const cookie = (await headers()).get("cookie");
  if (!cookie) return null;

  try {
    const res = await fetch(`${env.API_INTERNAL_URL}/api/auth/get-session`, {
      headers: { cookie },
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;
    return (await res.json()) ?? null;
  } catch {
    throw new Error("Server unreachable"); // backend unreachable
  }
});

export async function requireSession(): Promise<ServerSession> {
  const session = await getServerSession();
  if (!session) redirect("/login");
  return session;
}

export async function requireAdmin(): Promise<ServerSession> {
  const session = await requireSession();
  if (session.user.role !== "admin") {
    redirect("/");
  }
  return session;
}
