import { type Testimonial, testimonials as defaults } from "@/lib/content";

export default function Testimonials({
  heading,
  items = defaults,
}: {
  heading: string;
  items?: Testimonial[];
}) {
  const testimonials = items;
  return (
    <div className="flex flex-col gap-5">
      <h2 className="section-title">{heading}</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {testimonials.map((t) => (
          <figure key={t.name} className="card flex flex-col gap-3">
            <div
              aria-hidden
              className="flex h-12 w-12 items-center justify-center rounded-full bg-brand font-display text-lg text-white"
            >
              {t.name[0]}
            </div>
            <blockquote className="text-sm leading-relaxed">“{t.quote}”</blockquote>
            <figcaption className="mt-auto">
              <p className="text-sm font-bold">{t.name}</p>
              <p className="text-xs text-muted">{t.journey}</p>
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="text-xs text-muted italic">
        Labelled honestly: mentored or hired by Anjan until batch 1 graduates.
      </p>
    </div>
  );
}
