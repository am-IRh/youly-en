import Link from "next/link";
import { api } from "@/lib/api-client";

export default async function PendingLessonsPage() {
  const { data } = await api.api.lessons.pending.get({ query: {} });
  const lessons = data?.items ?? [];

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">در انتظار تایید ({data?.total ?? 0})</h1>
      {lessons.length === 0 && <p className="text-neutral-400">چیزی برای بررسی نیست.</p>}
      <ul className="space-y-2">
        {lessons.map((lesson) => (
          <li
            key={lesson.id}
            className="flex items-center justify-between rounded-lg border border-neutral-800 p-4"
          >
            <span>{lesson.title}</span>
            <Link href={`/admin/lessons/${lesson.id}`} className="text-sm underline">
              بررسی
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
