"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemaTypes";
import { apiVersion, dataset, projectId } from "./sanity/env";

const singletons = new Set([
  "siteSettings",
  "homePage",
  "founder",
  "program",
  "aboutPage",
  "communityPage",
  "leadMagnet",
]);

export default defineConfig({
  name: "fundamental",
  title: "Fundamental Institute",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            // Singletons open the one document directly
            ...[
              ["siteSettings", "Site settings"],
              ["homePage", "Home page"],
              ["founder", "Founder"],
              ["program", "Program"],
              ["aboutPage", "About page"],
              ["communityPage", "Community page"],
              ["leadMagnet", "Lead magnet"],
            ].map(([type, title]) =>
              S.listItem()
                .title(title)
                .id(type)
                .child(S.document().schemaType(type).documentId(type)),
            ),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (item) => !singletons.has(item.getId() ?? ""),
            ),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  schema: { types: schemaTypes },
});
