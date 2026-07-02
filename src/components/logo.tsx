import config, { brand } from "@/lib/config";

export function Logo({ size = 32 }: { size?: number }) {
  // VOS-BRAND-LOGO-GEN: render the generated logomark when present; otherwise
  // fall back to gradient initials.
  const logoUrl = brand.logoUrl;
  if (logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logoUrl}
        alt={`${config.name} logo`}
        width={size}
        height={size}
        className="rounded-lg shrink-0 object-contain"
        style={{ width: size, height: size }}
      />
    );
  }

  const initials = config.name
    .split(/[\s-]+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="rounded-lg flex items-center justify-center font-bold text-white shrink-0"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        background: `linear-gradient(135deg, ${config.brand.primary}, ${config.brand.accent})`,
      }}
    >
      {initials}
    </div>
  );
}

export function LogoWithName({ size = 32 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <Logo size={size} />
      <span className="font-bold text-lg">{config.name}</span>
    </div>
  );
}
