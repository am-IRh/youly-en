import Link from "next/link";
import { api } from "@/lib/api-client";

export default async function AdminCoursesPage() {
  const { data } = await api.api.courses.get({ query: { limit: 50 } });
  const courses = data?.items ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">دوره‌ها</h1>
        <Link
          href="/admin/courses/new"
          className="rounded-md bg-white px-4 py-2 text-sm text-black"
        >
          + دوره‌ی جدید
        </Link>
      </div>
      <ul className="space-y-2">
        {courses.map((course) => (
          <li
            key={course.id}
            className="flex items-center justify-between rounded-lg border border-neutral-800 p-4"
          >
            <span>{course.title}</span>
            <Link href={`/admin/courses/${course.id}`} className="text-sm underline">
              مدیریت
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
