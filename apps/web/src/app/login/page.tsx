"use client";
import { useForm } from "@tanstack/react-form";
import { isValidIranPhone, toE164 } from "@youly-en/utils/phone";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneE164, setPhoneE164] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);

  const phoneForm = useForm({
    defaultValues: { phone: "" },
    onSubmit: async ({ value }) => {
      setServerError(null);
      const e164 = toE164(value.phone);
      const { error } = await authClient.phoneNumber.sendOtp({ phoneNumber: e164 });
      if (error) return setServerError(error.message ?? "خطا در ارسال کد");
      setPhoneE164(e164);
      setStep("otp");
    },
  });

  const otpForm = useForm({
    defaultValues: { code: "" },
    onSubmit: async ({ value }) => {
      setServerError(null);
      const { error } = await authClient.phoneNumber.verify({
        phoneNumber: phoneE164,
        code: value.code,
      });
      if (error) return setServerError(error.message ?? "کد اشتباهه");
      router.refresh();
    },
  });

  return step === "phone" ? (
    <form
      className="mx-auto mt-20 max-w-sm space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        phoneForm.handleSubmit();
      }}
    >
      <phoneForm.Field
        name="phone"
        validators={{
          onChange: ({ value }) =>
            !isValidIranPhone(value) ? "شماره باید با 09 شروع بشه و 11 رقم باشه" : undefined,
        }}
      >
        {(field) => (
          <div>
            <Input
              inputMode="numeric"
              placeholder="09123456789"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
            />
            {field.state.meta.errors[0] && (
              <p className="mt-1 text-red-500 text-sm">{field.state.meta.errors[0]}</p>
            )}
          </div>
        )}
      </phoneForm.Field>

      <phoneForm.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <Button type="submit" disabled={!canSubmit || isSubmitting} className="w-full">
            ارسال کد
          </Button>
        )}
      </phoneForm.Subscribe>

      {serverError && <p className="text-red-500 text-sm">{serverError}</p>}
    </form>
  ) : (
    <form
      className="mx-auto mt-20 max-w-sm space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        otpForm.handleSubmit();
      }}
    >
      <otpForm.Field
        name="code"
        validators={{
          onChange: ({ value }) => (!/^\d{6}$/.test(value) ? "کد باید ۶ رقم باشه" : undefined),
        }}
      >
        {(field) => (
          <div>
            <Input
              inputMode="numeric"
              placeholder="کد ۶ رقمی"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              // onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
            />
            {field.state.meta.errors[0] && (
              <p className="mt-1 text-red-500 text-sm">{field.state.meta.errors[0]}</p>
            )}
          </div>
        )}
      </otpForm.Field>

      <otpForm.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <Button type="submit" disabled={!canSubmit || isSubmitting} className="w-full">
            تایید و ورود
          </Button>
        )}
      </otpForm.Subscribe>

      {serverError && <p className="text-red-500 text-sm">{serverError}</p>}
    </form>
  );
}
