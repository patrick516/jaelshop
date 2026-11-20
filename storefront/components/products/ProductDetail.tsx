"use client"; // the selection hook uses state

import type { Product, Settings } from "@/types";
import { useVariantSelection } from "@/hooks/useVariantSelection";
import QuantityStepper from "@/components/shared/QuantityStepper";
import DeliveryInfo from "@/components/shared/DeliveryInfo";
import ProductGallery from "./ProductGallery";
import ProductHeader from "./ProductHeader";
import OptionChips from "./OptionChips";
import ProductActions from "./ProductActions";
import ProductReviews from "./ProductReviews";

// Only puts the pieces together. Each piece lives in its own file
export default function ProductDetail({
  product,
  settings,
}: {
  product: Product;
  settings: Settings;
}) {
  const sel = useVariantSelection(product);
  const { selected, stock } = sel;

  return (
    <div className="space-y-6 md:grid md:grid-cols-2 md:gap-8 md:space-y-0">
      <ProductGallery images={product.images} name={product.name} />

      <div className="space-y-5">
        <ProductHeader product={product} price={sel.price} />
        <OptionChips
          title="Size"
          options={sel.sizes}
          value={sel.size}
          onPick={sel.pickSize}
          inStock={sel.sizeInStock}
        />
        <OptionChips
          title="Colour"
          options={sel.colors}
          value={sel.color}
          onPick={sel.pickColor}
          inStock={sel.colorInStock}
        />

        <p
          className={`text-sm font-semibold ${stock > 0 ? "text-green-600" : "text-destructive"}`}
        >
          {!selected
            ? "This combination is not available"
            : stock === 0
              ? "Out of stock"
              : stock <= 5
                ? `Only ${stock} left`
                : "In stock"}
        </p>

        <div className="flex items-center gap-4">
          <p className="text-sm font-bold text-navy">Quantity</p>
          <QuantityStepper
            value={sel.qty}
            max={Math.max(stock, 1)}
            onChange={sel.setQty}
          />
        </div>

        <ProductActions product={product} settings={settings} sel={sel} />
        <DeliveryInfo />

        {product.description && (
          <div>
            <h2 className="mb-1 font-extrabold text-navy">Description</h2>
            <p className="whitespace-pre-line text-sm text-muted-foreground">
              {product.description}
            </p>
          </div>
        )}
        <ProductReviews reviews={product.reviews ?? []} />
      </div>
    </div>
  );
}
