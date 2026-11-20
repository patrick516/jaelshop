// The app icon: the orange shopping bag from the site header, on navy.
// maskable icons get extra empty space, because Android may crop them into a circle
export function iconImage(size: number, maskable: boolean) {
  const box = Math.round(size * (maskable ? 0.5 : 0.62)); // the orange square
  const bag = Math.round(box * 0.58);

  return (
    <div style={{ width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center", background: "#0A2540" }}>
      <div style={{ width: box, height: box, display: "flex", alignItems: "center", justifyContent: "center", background: "#F97316", borderRadius: Math.round(box * 0.24) }}>
        <svg width={bag} height={bag} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      </div>
    </div>
  );
}
