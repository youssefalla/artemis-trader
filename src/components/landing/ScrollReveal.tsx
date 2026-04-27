"use client";

import { useEffect } from "react";

function triggerBlurIn(el: HTMLElement) {
  const words = el.querySelectorAll<HTMLElement>(".bw");
  words.forEach((word, i) => {
    const delay = Math.pow(i / Math.max(words.length, 1), 0.8) * 0.3 + i * 0.036;
    word.style.transitionDelay = `${delay.toFixed(3)}s`;
  });
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.classList.add("in");
    });
  });
}

export default function ScrollReveal() {
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>(
      ".reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger"
    );

    if (!("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("in"));
      document.querySelectorAll<HTMLElement>("[data-blur='section']").forEach(triggerBlurIn);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    targets.forEach((el) => io.observe(el));

    const blurHeadlines = document.querySelectorAll<HTMLElement>("[data-blur='section']");
    const blurIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            triggerBlurIn(entry.target as HTMLElement);
            blurIo.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -5% 0px" }
    );
    blurHeadlines.forEach((el) => blurIo.observe(el));

    return () => {
      io.disconnect();
      blurIo.disconnect();
    };
  }, []);

  return null;
}
