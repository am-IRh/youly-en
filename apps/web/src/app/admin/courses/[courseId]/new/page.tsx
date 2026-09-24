"use client";

import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api-client";

export default function NewCoursePage() {
  const router = useRouter();

  const form = useForm({
    defaultValues: { slug: "", title: "", description: "" },
    onSubmit: async ({ value }) => {
      const { data, error } = await api.api.courses.post(value);
      if (error) return alert("خطا در ساخت دوره");
      router.push(`/admin/courses/${data!.id}`);
    },
  });

  return (
    <form
      className="max-w-md space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <h1 className="text-xl font-bold">دوره‌ی جدید</h1>

      <form.Field name="title">
        {(field) => (
          <Input
            placeholder="عنوان دوره"
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
          />
        )}
      </form.Field>

      <form.Field name="slug">
        {(field) => (
          <Input
            placeholder="slug (مثلاً 4000-vocab)"
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
          />
        )}
      </form.Field>

      <form.Field name="description">
        {(field) => (
          <textarea
            className="w-full rounded-md border border-neutral-800 bg-transparent p-2 text-sm"
            placeholder="توضیحات"
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
          />
        )}
      </form.Field>

      <Button type="submit" className="w-full">
        ساخت دوره
      </Button>
    </form>
  );
}
