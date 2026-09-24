import Link from "next/link";
import { notFound } from "next/navigation";
import { api } from "@/lib/api-client";

export default async function AdminCourseDetail({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const { data: levelsData } = await api.api.levels.get({
    query: { courseId, limit: 50 } as never,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">سطح‌ها</h1>
        <Link
          href={`/admin/courses/${courseId}/new`}
          className="rounded-md bg-white px-4 py-2 text-sm text-black"
        >
          + سطح جدید
        </Link>
      </div>
      <ul className="space-y-2">
        {levelsData?.map((level) => (
          <li key={level.id} className="rounded-lg border border-neutral-800 p-4">
            {level.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
