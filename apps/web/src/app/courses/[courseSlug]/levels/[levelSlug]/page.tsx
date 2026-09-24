import { notFound } from "next/navigation";
import { api } from "@/lib/api-client";

export default async function LevelPage({
  params,
}: {
  params: Promise<{ courseSlug: string; levelSlug: string }>;
}) {
  const { courseSlug, levelSlug } = await params;

  const { data, status } = await api.api
    .courses({ courseSlug })
    .levels({ levelSlug })
    .lessons.get();

  if (status === 404 || !data) notFound();

  const lessons = data.items;

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-6">
      <ul className="space-y-2">
        {lessons.map((lesson) => (
          <li key={lesson.id}>
            <a
              href={`/courses/${courseSlug}/levels/${levelSlug}/lessons/${lesson.slug}`}
              className="hover:underline"
            >
              {lesson.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
