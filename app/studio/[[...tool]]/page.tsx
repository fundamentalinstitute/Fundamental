"use client";

/**
 * Embedded Sanity Studio at /studio — sign in with your Sanity account to
 * edit all site content.
 */
import { Studio } from "sanity";
import config from "@/sanity.config";

export default function StudioPage() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "#fff" }}>
      <Studio config={config} />
    </div>
  );
}
