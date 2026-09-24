"use client";

import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api-client";

async function fetchLesson(lessonId: string) {
  const { data } = await api.api.lessons({ lessonId }).get();
  return data;
}

export default function ReviewLessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = use(params);
  const router = useRouter();
  const [lesson, setLesson] = useState<Awaited<ReturnType<typeof fetchLesson>> | null>(null);
  const [loading, setLoading] = useState(true);

  useState(() => {
    fetchLesson(lessonId).then((data) => {
      setLesson(data);
      setLoading(false);
    });
  });

  async function handleReview(decision: "published" | "rejected") {
    await api.api.lessons({ lessonId }).review.post({ decision });
    router.push("/admin/lessons/pending");
  }

  if (loading) return <p>در حال بارگذاری...</p>;
  if (!lesson) return <p>پیدا نشد.</p>;

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-xl font-bold">{lesson.title}</h1>
      <pre className="whitespace-pre-wrap rounded-md border border-neutral-800 p-4 text-sm">
        {JSON.stringify(lesson.content, null, 2)}
      </pre>
      <div className="flex gap-2">
        <Button onClick={() => handleReview("published")}>تایید</Button>
        <Button variant="destructive" onClick={() => handleReview("rejected")}>
          رد
        </Button>
      </div>
    </div>
  );
}
