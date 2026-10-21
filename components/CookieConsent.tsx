"use client";

import { useEffect, useState } from "react";

/**
 * Cookie consent: banner with Accept all / Reject non-essential / Customize,
 * persisted in localStorage and re-openable via the footer "Cookie
 * preferences" link (window event "fi-open-consent").
 *
 * Non-essential scripts must check consent before loading — see
 * ConsentScripts below, which only injects analytics/advertising scripts
 * after the matching category is granted.
 */

const STORAGE_KEY = "fi-consent-v1";

export interface Consent {
  necessary: true;
  analytics: boolean;
  advertising: boolean;
  ts: number;
}

export function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const c = JSON.parse(raw);
    if (typeof c?.analytics !== "boolean") return null;
    return c as Consent;
  } catch {
    return null;
  }
}

function saveConsent(analytics: boolean, advertising: boolean) {
  const consent: Consent = { necessary: true, analytics, advertising, ts: Date.now() };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  } catch {}
  window.dispatchEvent(new CustomEvent("fi-consent-changed", { detail: consent }));
}

const CATEGORIES = [
  {
    key: "necessary" as const,
    label: "Necessary",
    desc: "Required for the site to work (forms, security). Always on.",
    locked: true,
  },
  {
    key: "analytics" as const,
    label: "Analytics",
    desc: "Helps us understand how the site is used (e.g. Google Analytics, PostHog).",
    locked: false,
  },
  {
    key: "advertising" as const,
    label: "Advertising",
    desc: "Used to measure ad campaigns and show relevant ads (e.g. Meta Pixel).",
    locked: false,
  },
];

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [advertising, setAdvertising] = useState(true);

  useEffect(() => {
    const existing = readConsent();
    if (!existing) setVisible(true);
    const reopen = () => {
      const c = readConsent();
      setAnalytics(c?.analytics ?? true);
      setAdvertising(c?.advertising ?? true);
      setCustomizing(true);
      setVisible(true);
    };
    window.addEventListener("fi-open-consent", reopen);
    return () => window.removeEventListener("fi-open-consent", reopen);
  }, []);

  if (!visible) return <ConsentScripts />;

  const close = () => {
    setVisible(false);
    setCustomizing(false);
  };

  return (
    <>
      <ConsentScripts />
      <div
        role="dialog"
        aria-label="Cookie preferences"
        className="fixed right-0 bottom-0 left-0 z-[60] border-t border-line bg-white p-4 shadow-[0_-8px_30px_rgba(0,66,37,0.15)] sm:right-5 sm:bottom-5 sm:left-auto sm:max-w-md sm:rounded-2xl sm:border"
      >
        {!customizing ? (
          <div className="flex flex-col gap-3">
            <p className="text-sm font-bold">We value your privacy</p>
            <p className="text-xs leading-relaxed text-muted">
              We use cookies to run this site and, with your permission, to
              understand how it&apos;s used and to measure our marketing.
              You can change your choice anytime via &ldquo;Cookie
              preferences&rdquo; in the footer. See our{" "}
              <a href="/privacy" className="text-brand underline">
                privacy policy
              </a>
              .
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="btn-primary px-4 py-2 text-xs"
                onClick={() => {
                  saveConsent(true, true);
                  close();
                }}
              >
                Accept all
              </button>
              <button
                type="button"
                className="btn-secondary px-4 py-2 text-xs"
                onClick={() => {
                  saveConsent(false, false);
                  close();
                }}
              >
                Reject non-essential
              </button>
              <button
                type="button"
                className="cursor-pointer px-2 py-2 text-xs font-semibold text-brand underline underline-offset-2"
                onClick={() => setCustomizing(true)}
              >
                Customize
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-sm font-bold">Cookie preferences</p>
            {CATEGORIES.map((cat) => {
              const checked =
                cat.key === "necessary"
                  ? true
                  : cat.key === "analytics"
                    ? analytics
                    : advertising;
              return (
                <label
                  key={cat.key}
                  className="flex items-start gap-3 rounded-md border border-line p-3"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={cat.locked}
                    onChange={(e) =>
                      cat.key === "analytics"
                        ? setAnalytics(e.target.checked)
                        : setAdvertising(e.target.checked)
                    }
                    className="mt-0.5 h-4 w-4 accent-brand"
                  />
                  <span>
                    <span className="block text-xs font-bold">
                      {cat.label}
                      {cat.locked && (
                        <span className="ml-2 font-normal text-muted">(always on)</span>
                      )}
                    </span>
                    <span className="block text-xs text-muted">{cat.desc}</span>
                  </span>
                </label>
              );
            })}
            <div className="flex gap-2">
              <button
                type="button"
                className="btn-primary px-4 py-2 text-xs"
                onClick={() => {
                  saveConsent(analytics, advertising);
                  close();
                }}
              >
                Save preferences
              </button>
              <button
                type="button"
                className="btn-secondary px-4 py-2 text-xs"
                onClick={() => setCustomizing(false)}
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/**
 * Loads analytics/advertising scripts ONLY after consent for the matching
 * category. No-ops while env IDs are unset — gating is in place for when
 * they're added.
 */
function ConsentScripts() {
  useEffect(() => {
    const load = () => {
      const consent = readConsent();
      if (!consent) return;

      const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
      if (consent.analytics && gaId && !document.getElementById("fi-ga")) {
        const s = document.createElement("script");
        s.id = "fi-ga";
        s.async = true;
        s.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(s);
        const inline = document.createElement("script");
        inline.id = "fi-ga-init";
        inline.textContent = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`;
        document.head.appendChild(inline);
      }

      const phKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
      const phHost = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://app.posthog.com";
      if (consent.analytics && phKey && !document.getElementById("fi-ph")) {
        const s = document.createElement("script");
        s.id = "fi-ph";
        s.textContent = `!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);posthog.init('${phKey}',{api_host:'${phHost}'});`;
        document.head.appendChild(s);
      }

      // Advertising scripts (e.g. Meta Pixel) go here, gated on
      // consent.advertising, when campaign tracking is added.
    };

    load();
    window.addEventListener("fi-consent-changed", load);
    return () => window.removeEventListener("fi-consent-changed", load);
  }, []);

  return null;
}
