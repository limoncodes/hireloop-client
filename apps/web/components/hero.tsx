
import Image from "next/image"
import { Briefcase, Building2, MapPin, Search, Star, UserRound } from "lucide-react"

import globe from "@/app/images/globe.png"

const manropeStyle = { fontFamily: "var(--font-manrope)" } as const
const spaceMonoStyle = { fontFamily: "var(--font-space-mono)" } as const

const trendingTags = ["Product Designer", "AI Engineering", "Dev-ops Engineer"]

const stats = [
  { icon: Briefcase, number: "50K", label: "Active Jobs" },
  { icon: Building2, number: "12K", label: "Companies" },
  { icon: UserRound, number: "2M", label: "Job Seekers" },
  { icon: Star, number: "97%", label: "Satisfaction Rate" },
]

function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#010103]">
      {/* Ambient glows behind the hero copy */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[700px]">
        <div className="absolute -top-56 left-1/2 h-[620px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(92,83,254,0.22),transparent)] blur-3xl" />
        <div className="absolute -top-24 -left-24 h-[480px] w-[520px] rounded-full bg-[radial-gradient(closest-side,rgba(220,2,206,0.12),transparent)] blur-3xl" />
        <div className="absolute -top-24 -right-20 h-[480px] w-[560px] rounded-full bg-[radial-gradient(closest-side,rgba(97,79,251,0.16),transparent)] blur-3xl" />
      </div>

      {/* Centered hero copy */}
      <div className="relative mx-auto w-full max-w-[1280px] px-6 pt-24 pb-12 text-center sm:pt-48">
        {/* Announcement badge */}
        <div className="flex items-center justify-center">
          <div className="flex items-center rounded-full bg-[#14141A] p-1">
            <span className="flex items-center gap-3 rounded-full border border-[#5C53FE]/40 bg-[linear-gradient(90deg,rgba(92,83,254,0.25),rgba(220,2,206,0.15))] px-5 py-2.5 shadow-[inset_0_0_6px_rgba(255,255,255,0.1)]">
              <Briefcase className="size-5 text-[#F97316]" />
              <span className="text-sm uppercase text-white" style={spaceMonoStyle}>
                50,000+ new jobs this month
              </span>
            </span>
          </div>
        </div>

        {/* Title + description */}
        <h1
          className="mx-auto mt-9 max-w-[760px] text-4xl font-bold leading-[1.15] tracking-[-0.02em] text-white sm:text-5xl md:text-[56px]"
          style={manropeStyle}
        >
          Find Your Dream Job Today
        </h1>

        <p
          className="mx-auto mt-5 max-w-[720px] text-lg leading-[1.6] text-white/70 md:text-xl"
          style={manropeStyle}
        >
          HireLoop connects top talent with world-class companies. Browse thousands
          of curated opportunities and land your next role — faster.
        </p>

        {/* Search bar */}
        <div className="mx-auto mt-12 max-w-[784px]">
          <div className="flex h-14 items-center gap-3 rounded-xl border border-white/10 bg-[#101010]/90 px-3 pl-5 shadow-[0_1px_2px_rgba(0,0,0,0.3)] md:gap-4">
            <div className="flex min-w-0 flex-1 items-center gap-2.5">
              <Search className="size-5 shrink-0 text-white/90" />
              <input
                type="search"
                placeholder="Job title or company"
                className="w-full min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-white/90 md:text-base"
                style={manropeStyle}
              />
            </div>

            <span aria-hidden className="hidden h-6 w-px bg-white/15 md:block" />

            <div className="hidden min-w-0 flex-[1.1] items-center gap-2.5 md:flex">
              <MapPin className="size-5 shrink-0 text-white/90" />
              <input
                type="search"
                placeholder="Location or Remote"
                className="w-full min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-white/90 md:text-base"
                style={manropeStyle}
              />
            </div>

            <button
              type="button"
              aria-label="Search jobs"
              className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-[#5C53FE] text-white transition-colors hover:bg-[#6D65FF]"
            >
              <Search className="size-5" />
            </button>
          </div>

          {/* Trending tags */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-4 gap-y-3">
            <span className="text-sm text-white/60" style={manropeStyle}>
              Trending Position
            </span>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {trendingTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-[#1A1A1B] px-3 py-1.5 text-sm text-[#EDEDEF]"
                  style={manropeStyle}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats band — Glowing Globe */}
      <div className="relative mx-auto w-full max-w-[1280px] px-6 pt-36 pb-24 sm:pt-[300px] sm:pb-28">
        <div className="relative">
          <Image
            src={globe}
            alt=""
            aria-hidden
            priority
            width={1440}
            height={1882}
            sizes="(max-width: 640px) 720px, 1900px"
            className="pointer-events-none absolute left-1/2 top-[-480px] w-[720px] max-w-none -translate-x-1/2 brightness-[0.85] sm:top-[-1346px] sm:w-[1900px]"
            style={{
              maskImage:
                "linear-gradient(to bottom, transparent 0%, transparent 24%, rgba(0,0,0,0.9) 36%, black 42%, black 50%, rgba(0,0,0,0.35) 63%, rgba(0,0,0,0.1) 78%, transparent 90%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, transparent 24%, rgba(0,0,0,0.9) 36%, black 42%, black 50%, rgba(0,0,0,0.35) 63%, rgba(0,0,0,0.1) 78%, transparent 90%)",
            }}
          />

          <h2
            className="relative mx-auto max-w-[640px] text-center text-xl font-bold leading-[1.3] text-white/90 sm:text-[36px]"
            style={manropeStyle}
          >
            Assisting over 15,000 job seekers find their dream positions.
          </h2>
        </div>

        {/* Stats cards */}
        <div className="relative mt-6 grid grid-cols-4 gap-2 sm:mt-12 sm:gap-4">
          {stats.map(({ icon: Icon, number, label }) => (
            <div
              key={label}
              className="flex min-h-[122px] flex-col rounded-xl border border-white/[0.08] bg-[#0B0B0F] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:min-h-[254px] sm:p-5"
            >
              <Icon className="size-3.5 text-white sm:size-5" />

              <div className="mt-auto">
                <div
                  className="text-[28px] font-bold text-white sm:text-[48px]"
                  style={manropeStyle}
                >
                  {number}
                </div>

                <div
                  className="mt-1 text-[9px] text-white/60 sm:mt-2 sm:text-sm"
                  style={manropeStyle}
                >
                  {label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export { Hero }
