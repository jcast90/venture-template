"use client";

// NOTE: named "GradientText" for backward compatibility with every template
// that imports it, but per the Venture OS design bible (no gradients, ever)
// this now renders a FLAT accent-colored span. Emphasis comes from color and
// weight, not a color ramp.
export function GradientText({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ color: "var(--brand-primary)" }}>{children}</span>
  );
}

export function BrandIconBox({
  children,
  size = "md",
}: {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses =
    size === "sm"
      ? "h-8 w-8 rounded-lg"
      : size === "lg"
        ? "h-14 w-14 rounded-2xl"
        : "h-12 w-12 rounded-xl";
  return (
    <div
      className={`inline-flex items-center justify-center ${sizeClasses}`}
      style={{
        // Flat, quiet tint of the accent with a single hairline. No gradient.
        background: "color-mix(in srgb, var(--brand-primary) 12%, transparent)",
        borderWidth: 1,
        borderColor: "color-mix(in srgb, var(--brand-primary) 22%, transparent)",
      }}
    >
      {children}
    </div>
  );
}
