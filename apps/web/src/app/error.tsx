"use client";

import { Button } from "@/components/ui/button";

export default function ErrorBoundary({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto mt-32 max-w-md text-center">
      <h1 className="font-bold text-2xl">مشکلی پیش اومد</h1>
      <Button onClick={reset} className="mt-4 underline">
        تلاش دوباره
      </Button>
    </div>
  );
}
