import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { Product } from "./types";
import { buildPayload, EMPTY_FORM, toValues, type FormValues, type SetValue } from "./productForm";

// The form state and the save request. id is set when editing and missing when adding.
// onSaved runs after a successful save
export function useProductForm(id: string | undefined, onSaved: () => void) {
  const [values, setValues] = useState<FormValues>(EMPTY_FORM);
  const [loading, setLoading] = useState(!!id); // editing: wait for the saved product first
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!id) return;
    api
      .get<Product>(`/products/${id}`)
      .then((res) => setValues(toValues(res.data)))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const set: SetValue = (key, value) => setValues((v) => ({ ...v, [key]: value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!values.categoryId) return setError("Please choose a category");
    setError("");
    setBusy(true);
    try {
      if (id) await api.put(`/products/${id}`, buildPayload(values, true));
      else await api.post("/products", buildPayload(values, false));
      toast.success(id ? "Product updated" : "Product created");
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setBusy(false);
    }
  };

  return { values, set, loading, error, busy, submit };
}
