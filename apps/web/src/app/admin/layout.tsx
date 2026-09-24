import { AdminSidebar } from "@/components/admin/sidebar";
import { requireAdmin } from "@/lib/session";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin(); // اگه ادمین نبود همین‌جا ریدایرکت می‌شه، بقیه اصلاً رندر نمی‌شه

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
