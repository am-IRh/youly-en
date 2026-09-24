import { api } from "@/lib/api-client";

export default async function CoursesPage() {
  const { data, error } = await api.api.courses.get();
  if (error) return <p className="text-red-500">خطا در دریافت دوره‌ها</p>;

  const { items: courses } = data;

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-6">
      <h1 className="font-bold text-2xl">دوره‌ها</h1>
      <ul className="space-y-2">
        {courses.map((course) => (
          <li key={course.id} className="rounded-lg border border-neutral-800 p-4">
            <a href={`/courses/${course.slug}`} className="font-medium text-lg hover:underline">
              {course.title}
            </a>
            <p className="text-neutral-400 text-sm">{course.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
