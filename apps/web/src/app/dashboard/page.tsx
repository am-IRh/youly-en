import { requireSession } from "@/lib/session";
import Dashboard from "./dashboard";

export default async function DashboardPage() {
  const session = await requireSession();
  console.log(session);
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome {session.user.name}</p>
      <Dashboard />
    </div>
  );
}
