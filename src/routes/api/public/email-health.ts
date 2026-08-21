import { createFileRoute } from "@tanstack/react-router";

/** Diagnostic: reports whether email credentials are present in the server runtime. */
export const Route = createFileRoute("/api/public/email-health")({
  server: {
    handlers: {
      GET: async () => {
        return new Response(
          JSON.stringify({
            hasLovableKey: Boolean(process.env["LOVABLE_API_KEY"]),
            hasResendKey: Boolean(process.env["RESEND_API_KEY"]),
            from: process.env["NOTIFY_EMAIL_FROM"] ?? "ADFI Website <noreply@adfi.vn>",
            to: process.env["NOTIFY_EMAIL_TO"] ?? "contact@adfi.vn",
          }),
          { headers: { "content-type": "application/json" } },
        );
      },
    },
  },
});
