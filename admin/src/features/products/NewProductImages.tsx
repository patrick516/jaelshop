import PictureGrid from "./PictureGrid";
import PictureUploadButton from "./PictureUploadButton";

type Props = { urls: string[]; onChange: (urls: string[]) => void };

// Pictures for a product that is not saved yet. The first one is the main picture
export default function NewProductImages({ urls, onChange }: Props) {
  const pictures = urls.map((url, i) => ({ key: url, url, isMain: i === 0 }));

  return (
    <div className="space-y-3">
      <PictureGrid pictures={pictures} onRemove={(key) => onChange(urls.filter((u) => u !== key))} onMakeMain={(key) => onChange([key, ...urls.filter((u) => u !== key)])} />
      <PictureUploadButton onUploaded={(url) => onChange([...urls, url])} label={urls.length ? "Add another picture" : "Upload picture"} />
      <p className="text-xs text-muted-foreground">The first picture is the main one shoppers see first.</p>
    </div>
  );
}
