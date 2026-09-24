"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "داشبورد" },
  { href: "/admin/courses", label: "دوره‌ها" },
  { href: "/admin/lessons/pending", label: "در انتظار تایید" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 border-neutral-800 p-4 border-l">
      <nav className="space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block rounded-md px-3 py-2 text-sm ${
              pathname === link.href
                ? "bg-neutral-800 font-medium"
                : "text-neutral-400 hover:bg-neutral-900"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
