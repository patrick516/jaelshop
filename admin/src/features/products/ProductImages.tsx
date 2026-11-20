import { toast } from "sonner";
import QueryState from "@/components/shared/QueryState";
import { useFetch } from "@/hooks/useFetch";
import { api } from "@/lib/api";
import PictureGrid from "./PictureGrid";
import PictureUploadButton from "./PictureUploadButton";
import type { Product } from "./types";

// The pictures of a saved product. Every change is saved straight away
export default function ProductImages({ productId }: { productId: string }) {
  const { data, error, loading, reload } = useFetch<Product>(
    `/products/${productId}`,
  );
  if (!data) return <QueryState loading={loading} error={error} />;

  const base = `/products/${productId}/images`;
  const act = async (request: () => Promise<unknown>) => {
    try {
      await request();
      reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    }
  };
  const pictures = data.images.map((i) => ({
    key: i.id,
    url: i.url,
    isMain: i.isPrimary,
  }));

  return (
    <div className="space-y-3">
      <PictureGrid
        pictures={pictures}
        onRemove={(id) => act(() => api.delete(`${base}/${id}`))}
        onMakeMain={(id) => act(() => api.patch(`${base}/${id}/primary`))}
      />
      <PictureUploadButton
        onUploaded={(added) =>
          act(async () => {
            for (const url of added) await api.post(base, { url }); // one after the other, so the first picture of a new product becomes its main one
          })
        }
        label="Add pictures"
      />
      <p className="text-xs text-muted-foreground">
        Picture changes are saved straight away.
      </p>
    </div>
  );
}
