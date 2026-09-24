import { notFound } from "next/navigation";
import { api } from "@/lib/api-client";

export default async function CoursePage({ params }: { params: Promise<{ courseSlug: string }> }) {
  const { courseSlug } = await params;

  const [{ data: course, status: courseStatus }, { data: levelsData }] = await Promise.all([
    api.api.courses({ courseSlug }).get(),
    api.api.courses({ courseSlug }).levels.get(),
  ]);
  console.log(course);
  if (courseStatus === 404 || !course) notFound();

  const levels = levelsData?.items ?? [];

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-6">
      <h1 className="font-bold text-2xl">{course.title}</h1>
      <ul className="space-y-2">
        {levels.map((level) => (
          <li key={level.id}>
            <a href={`/courses/${courseSlug}/levels/${level.slug}`} className="hover:underline">
              {level.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
