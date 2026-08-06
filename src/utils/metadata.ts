import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

interface CreateMetadataProps {
  title: string;
  description: string;
  path?: string;
}

export function createMetadata({
  title,
  description,
  path = "/",
}: CreateMetadataProps): Metadata {
  const url = new URL(path, siteConfig.url);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      type: "website",
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} preview`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [siteConfig.ogImage],
    },
  };
}
