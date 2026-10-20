export default function Section({
  tone = "white",
  children,
  id,
  className,
}: {
  tone?: "white" | "mist";
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={`${tone === "mist" ? "bg-mist" : "bg-paper"} border-b border-line ${className ?? ""}`}
    >
      <div className="container-site py-12 sm:py-14">{children}</div>
    </section>
  );
}
