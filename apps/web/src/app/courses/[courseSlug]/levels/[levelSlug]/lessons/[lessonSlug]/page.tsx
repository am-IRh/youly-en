import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api-client";

export default async function LessonPage({
  params,
}: {
  params: Promise<{
    courseSlug: string;
    levelSlug: string;
    lessonSlug: string;
  }>;
}) {
  const { courseSlug, levelSlug, lessonSlug } = await params;
  console.log(lessonSlug);
  const { data: lesson, error } = await api.api
    .courses({ courseSlug })
    .levels({ levelSlug })
    .lessons({ lessonSlug })
    .get();
  const c = await api.api
    .courses({ courseSlug })
    .levels({ levelSlug })
    .lessons({ lessonSlug })
    .get();

  console.log("lll", c);
  if (error || !lesson) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <p className="text-red-500">خطا در دریافت درس</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl space-y-8 p-6">
      <div>
        <Link
          href={`/courses/${courseSlug}/levels/${levelSlug}`}
          className="inline-flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground"
        >
          <ArrowRight className="size-4" />
          بازگشت به درس‌ها
        </Link>
      </div>

      <header className="space-y-4">
        <p className="font-medium text-muted-foreground text-sm">
          {levelSlug.replaceAll("-", " ")}
        </p>

        <h1 className="font-bold text-3xl">{lesson.title}</h1>
      </header>

      <article className="rounded-2xl border bg-card p-6">
        {/* فعلاً محتوای واقعی lesson.content را اینجا render می‌کنیم */}
        <div className="min-h-64 text-muted-foreground">محتوای درس اینجا قرار می‌گیرد.</div>
      </article>

      <div className="flex justify-end">
        <Button className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-medium text-primary-foreground text-sm">
          <CheckCircle2 className="size-4" />
          تکمیل درس
        </Button>
      </div>
    </main>
  );
}
