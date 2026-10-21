"use client";

/** Footer link that reopens the cookie preferences dialog. */
export default function CookiePrefsLink() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("fi-open-consent"))}
      className="cursor-pointer text-left text-sm text-white/75 hover:text-white"
    >
      Cookie preferences
    </button>
  );
}
