import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Field from "@/components/shared/Field";
import PasswordInput from "@/components/shared/PasswordInput";
import AuthCard from "./AuthCard";
import AvatarPicker from "./AvatarPicker";
import { useAuth } from "./useAuth";
import { useSetup } from "./useSetup";
import { useSetupStatus } from "./useSetupStatus";

// Shown only while the system has no staff at all. It creates the one and only administrator
export default function SetupPage() {
  const { user } = useAuth();
  const status = useSetupStatus();
  const { v, set, file, setFile, error, busy, submit } = useSetup();
  const mismatch = v.confirm !== "" && v.password !== v.confirm;

  if (user) return <Navigate to="/" replace />; // just created, or already logged in
  if (status.loading) return <div className="min-h-screen bg-navy" />;
  if (!status.needsSetup) return <Navigate to="/login" replace />; // setup is already done

  return (
    <AuthCard title="Set up your shop" subtitle="Create the administrator account. This happens only once. Everyone else is added later from Staff Users.">
      <form onSubmit={submit} className="space-y-4">
        <AvatarPicker file={file} onChange={setFile} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="First name" htmlFor="su-first">
            <Input id="su-first" required autoComplete="given-name" value={v.firstName} onChange={set("firstName")} />
          </Field>
          <Field label="Last name" htmlFor="su-last">
            <Input id="su-last" required autoComplete="family-name" value={v.lastName} onChange={set("lastName")} />
          </Field>
        </div>
        <Field label="Email" htmlFor="su-email">
          <Input id="su-email" type="email" required autoComplete="username" value={v.email} onChange={set("email")} />
        </Field>
        <Field label="Password" htmlFor="su-pass" hint="At least 8 characters. Mix letters and numbers.">
          <PasswordInput id="su-pass" required minLength={8} autoComplete="new-password" value={v.password} onChange={set("password")} />
        </Field>
        <Field label="Confirm password" htmlFor="su-confirm">
          <PasswordInput id="su-confirm" required autoComplete="new-password" value={v.confirm} onChange={set("confirm")} />
          {mismatch && <p className="text-xs font-semibold text-destructive">The passwords do not match</p>}
        </Field>
        {error && <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-destructive">{error}</p>}
        <Button disabled={busy} className="w-full bg-orange-500 hover:bg-orange-600">
          {busy ? "Creating..." : "Create administrator account"}
        </Button>
      </form>
    </AuthCard>
  );
}
