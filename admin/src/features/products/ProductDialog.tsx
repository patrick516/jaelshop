import { Skeleton } from "@/components/ui/skeleton";
import FormDialog from "@/components/shared/FormDialog";
import FormSection from "@/components/shared/FormSection";
import NewProductImages from "./NewProductImages";
import PricingFields from "./PricingFields";
import ProductFields from "./ProductFields";
import ProductImages from "./ProductImages";
import VariantsEditor from "./VariantsEditor";
import { useLookups } from "./useLookups";
import { useProductForm } from "./useProductForm";

type Props = { id?: string; onClose: () => void; onSaved: () => void };

// The pop-up to add a product (no id) or edit one (id)
export default function ProductDialog({ id, onClose, onSaved }: Props) {
  const { values, set, loading, error, busy, submit } = useProductForm(
    id,
    onSaved,
  );
  const { categories, brands, createCategory, createBrand } = useLookups();

  return (
    <FormDialog
      title={id ? "Edit product" : "Add product"}
      busy={busy}
      disabled={loading}
      error={error}
      onClose={onClose}
      onSubmit={submit}
      className="sm:max-w-3xl"
    >
      {loading ? (
        <Skeleton className="h-80 w-full" />
      ) : (
        <div className="space-y-6">
          <FormSection title="Basic information">
            <ProductFields
              values={values}
              set={set}
              categories={categories}
              brands={brands}
              onCreateCategory={createCategory}
              onCreateBrand={createBrand}
            />
          </FormSection>
          <FormSection title="Pricing (MWK)">
            <PricingFields values={values} set={set} />
          </FormSection>
          {id ? (
            <p className="rounded-lg bg-secondary p-3 text-sm text-muted-foreground">
              Sizes, colours and stock are changed on the Stock tab.
            </p>
          ) : (
            <FormSection title="Sizes, colours and stock">
              <VariantsEditor
                variants={values.variants}
                onChange={(v) => set("variants", v)}
              />
            </FormSection>
          )}
          <FormSection title="Pictures">
            {id ? (
              <ProductImages productId={id} />
            ) : (
              <NewProductImages
                urls={values.imageUrls}
                onChange={(u) => set("imageUrls", u)}
              />
            )}
          </FormSection>
        </div>
      )}
    </FormDialog>
  );
}
