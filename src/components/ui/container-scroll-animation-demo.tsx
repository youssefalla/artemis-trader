"use client"

import Image from "next/image"
import { ContainerScroll } from "@/components/ui/container-scroll-animation"

export function HeroScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden pb-[240px] pt-[420px] md:pb-[420px] md:pt-[720px]">
      <ContainerScroll
        titleComponent={
          <>
            <h2 className="text-4xl font-semibold text-[var(--text-primary)] md:text-6xl">
              Watch Artemis in motion
              <br />
              <span className="mt-1 block text-4xl font-bold leading-none text-[var(--accent)] md:text-[6rem]">
                Scroll the platform
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base text-[var(--text-secondary)] md:text-lg">
              See the dashboard preview, trade activity, and automation controls animate into focus as you move down the page.
            </p>
          </>
        }
      >
        <div className="relative h-full w-full overflow-hidden rounded-2xl bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.18),transparent_35%),linear-gradient(180deg,#150909_0%,#090909_100%)]">
          <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:36px_36px]" />
          <div className="relative z-10 flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 md:px-6">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs text-white/70">
                Artemis Dashboard Preview
              </div>
            </div>

            <div className="grid flex-1 gap-4 p-4 md:grid-cols-[1.15fr_0.85fr] md:p-6">
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-white/45">Live Overview</p>
                    <h3 className="mt-2 text-2xl font-semibold text-white md:text-3xl">$12,480.42</h3>
                  </div>
                  <div className="rounded-full bg-emerald-400/15 px-3 py-1 text-sm text-emerald-300">
                    +8.2% today
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  {[
                    ["Win Rate", "68%"],
                    ["Open Trades", "12"],
                    ["Bot Status", "Active"],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-white/8 bg-black/20 p-4">
                      <p className="text-xs text-white/45">{label}</p>
                      <p className="mt-2 text-xl font-semibold text-white">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 h-[220px] rounded-[22px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-4">
                  <div className="flex h-full items-end gap-2">
                    {[32, 54, 40, 76, 58, 96, 72, 112, 90, 128, 106, 146].map((height, index) => (
                      <div
                        key={index}
                        className="flex-1 rounded-t-full bg-[linear-gradient(180deg,rgba(248,113,113,0.95),rgba(220,38,38,0.25))]"
                        style={{ height }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="rounded-[24px] border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.22em] text-white/45">Broker Sync</p>
                  <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/8 bg-black/20 p-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-500/20 text-red-300">
                      XM
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">XM MT5 Connected</p>
                      <p className="text-xs text-white/50">Latency 42ms</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-3">
                    {["Low Risk Profile", "Auto stop-loss enabled", "Affiliate verified"].map((item) => (
                      <div key={item} className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3 text-sm text-white/80">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative min-h-[220px] overflow-hidden rounded-[24px] border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <Image
                    src="/window.svg"
                    alt="Decorative dashboard preview"
                    fill
                    className="pointer-events-none object-contain p-8 opacity-10"
                    draggable={false}
                  />
                  <div className="relative z-10">
                    <p className="text-xs uppercase tracking-[0.22em] text-white/45">Recent Activity</p>
                    <div className="mt-4 space-y-3">
                      {[
                        ["EUR/USD", "+$248.10"],
                        ["XAU/USD", "+$112.42"],
                        ["GBP/JPY", "-$38.50"],
                      ].map(([pair, pnl]) => (
                        <div key={pair} className="flex items-center justify-between rounded-2xl border border-white/8 bg-black/20 px-4 py-3">
                          <span className="text-sm text-white/80">{pair}</span>
                          <span className={`text-sm font-semibold ${pnl.startsWith("+") ? "text-emerald-300" : "text-rose-300"}`}>
                            {pnl}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ContainerScroll>
    </div>
  )
}
