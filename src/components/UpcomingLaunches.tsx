import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import { DEFAULT_UPCOMING, listLaunches, type LaunchRecord } from "../lib/database";
import { Reveal } from "./Reveal";

interface UpcomingLaunchesProps {
  onOpenCityBooking?: (city?: string, brand?: string) => void;
}

export function UpcomingLaunches({ onOpenCityBooking }: UpcomingLaunchesProps = {}) {
  const [launches, setLaunches] = useState<LaunchRecord[]>(DEFAULT_UPCOMING);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      listLaunches()
        .then((rows) => {
          if (!cancelled && rows.length > 0) setLaunches(rows);
        })
        .catch(() => setLaunches(DEFAULT_UPCOMING));
    };

    load();

    const handleUpdate = () => load();
    window.addEventListener("fck_launches_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      cancelled = true;
      window.removeEventListener("fck_launches_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const loop = useMemo(() => {
    if (launches.length === 0) return [];
    if (launches.length <= 3) return [...launches, ...launches, ...launches, ...launches];
    return [...launches, ...launches];
  }, [launches]);

  return (
    <section id="upcoming" className="relative overflow-hidden bg-gradient-to-b from-cream-50 via-[#fff6e6] to-cream-50 py-10 sm:py-14 scroll-mt-24">
      <div className="pointer-events-none absolute -left-28 top-24 h-80 w-80 rounded-full bg-amber-500/20 blur-3xl animate-blob" />
      <div className="pointer-events-none absolute -right-24 bottom-20 h-96 w-96 rounded-full bg-rose-500/15 blur-3xl animate-blob" style={{ animationDelay: "4s" }} />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto mb-13 max-w-3xl text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-maroon-900/15 bg-white/85 px-4 py-1.5 text-[12px] font-extrabold uppercase tracking-[0.16em] text-maroon-950 shadow-sm">
              <Sparkles size={14} className="text-orange-700" /> Launching Soon
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-5 font-display text-[27px] xs:text-3xl font-extrabold tracking-tight text-maroon-950 sm:text-5xl lg:text-6xl text-center whitespace-nowrap">
              Brewing in <span className="text-gradient-warm">new destinations</span>
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="mx-auto mt-4 max-w-2xl text-[17px] font-semibold leading-relaxed text-maroon-900 text-center">
              Fresh Family Cafe King outlets opening across the country — be the first to visit, or partner with us to open one in your city.
            </p>
          </Reveal>
        </div>
      </div>

      <div
        className="relative mx-auto max-w-[1500px] overflow-hidden py-3 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]"
        onMouseEnter={() => {
          if (trackRef.current) trackRef.current.style.animationPlayState = "paused";
        }}
        onMouseLeave={() => {
          if (trackRef.current) trackRef.current.style.animationPlayState = "running";
        }}
      >
        <div
          ref={trackRef}
          className="flex w-max animate-marquee gap-7 px-4"
          style={{ animationDuration: `${Math.max(28, loop.length * 7)}s` }}
        >
          {loop.map((launch, index) => (
            <figure
              key={`${launch.id}-${index}`}
              onClick={() => onOpenCityBooking?.(launch.city, launch.brand)}
              className="lift group relative w-[310px] flex-none cursor-pointer overflow-hidden rounded-[30px] border border-maroon-900/15 bg-white p-3 shadow-xl sm:w-[350px]"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-maroon-950">
                <img
                  src={launch.image_data}
                  alt={`${launch.brand} upcoming franchise opening in ${launch.city} — ${launch.date_text}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(event) => {
                    event.currentTarget.src = DEFAULT_UPCOMING[0].image_data;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                <span
                  className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-lg"
                  style={{ backgroundColor: launch.accent || "#8C1F28" }}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                  </span>
                  {launch.tag || "Coming Soon"}
                </span>
              </div>

              <figcaption className="flex items-start justify-between gap-4 px-2 py-4">
                <div>
                  <h3 className="font-display text-xl font-extrabold text-maroon-950">{launch.brand}</h3>
                  <div className="mt-1 flex items-center gap-1.5 text-[13.5px] font-bold text-amber-900">
                    <MapPin size={14} /> {launch.city}
                  </div>
                  <div className="mt-1 text-[13px] font-semibold text-maroon-800">{launch.date_text}</div>
                </div>
                <span className="mt-1 grid h-10 w-10 flex-none place-items-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg transition-transform group-hover:scale-110">
                  <ArrowRight size={17} />
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className="mt-10 text-center">
        <Reveal>
          <button
            type="button"
            onClick={() => onOpenCityBooking?.()}
            className="shine inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-amber-500 via-orange-600 to-rose-700 px-7 py-4 text-[15px] font-extrabold text-white shadow-xl shadow-orange-500/30 transition hover:-translate-y-0.5 cursor-pointer"
          >
            Book Your City <ArrowRight size={17} />
          </button>
        </Reveal>
      </div>
    </section>
  );
}
