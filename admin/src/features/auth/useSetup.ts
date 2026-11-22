import { useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { shrink } from "@/lib/upload";
import { useAuth } from "./useAuth";

type Key = "firstName" | "lastName" | "email" | "password" | "confirm";

// The setup form: checks the passwords, creates the administrator, then logs in
export function useSetup() {
  const { login } = useAuth();
  const [v, setV] = useState({ firstName: "", lastName: "", email: "", password: "", confirm: "" });
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (key: Key) => (e: ChangeEvent<HTMLInputElement>) => setV({ ...v, [key]: e.target.value });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (v.password.length < 8) return setError("The password must be at least 8 characters");
    if (v.password !== v.confirm) return setError("The passwords do not match");
    setError("");
    setBusy(true);
    try {
      const form = new FormData();
      form.append("firstName", v.firstName.trim());
      form.append("lastName", v.lastName.trim());
      form.append("email", v.email.trim());
      form.append("password", v.password);
      if (file) form.append("file", await shrink(file)); // a big phone photo is shrunk first
      await api.post("/auth/setup", form);
      await login(v.email.trim(), v.password); // the page then sends you to the dashboard
      toast.success("Welcome! Your administrator account is ready");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setBusy(false);
    }
  };

  return { v, set, file, setFile, error, busy, submit };
}
