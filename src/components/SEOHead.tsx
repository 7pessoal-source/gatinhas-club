"use client";

import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  schema?: object;
  ogImage?: string;
  ogType?: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  ogImageAlt?: string;
  twitterHandle?: string;
  noIndex?: boolean;
  keywords?: string;
}

const SEOHead = ({
  title,
  description,
  canonical,
  schema,
  ogImage,
  ogType = "website",
  ogImageWidth = 1200,
  ogImageHeight = 630,
  ogImageAlt,
  twitterHandle = "@gatinhasclub",
  noIndex = false,
  keywords,
}: SEOHeadProps) => {
  const fullTitle = title.includes("Gatinhas Club")
    ? title
    : `${title} | Gatinhas Club – Macapá AP`;
  const siteUrl = "https://www.gatinhasclub.site";
  const canonicalUrl = canonical ? `${siteUrl}${canonical}` : undefined;
  const defaultOg = `${siteUrl}/og-image.jpg`;
  const ogImageUrl = ogImage || defaultOg;
  const ogImageAltText = ogImageAlt || "Gatinhas Club – Acompanhantes em Macapá AP";

  useEffect(() => {
    document.title = fullTitle;

    const updateMeta = (name: string, content: string, isProperty = false) => {
      let element = document.querySelector(
        isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`
      ) as HTMLMetaElement;
      if (!element) {
        element = document.createElement("meta");
        if (isProperty) {
          element.setAttribute("property", name);
        } else {
          element.setAttribute("name", name);
        }
        document.head.appendChild(element);
      }
      element.content = content;
    };

    updateMeta("description", description);
    if (keywords) updateMeta("keywords", keywords);
    updateMeta("robots", noIndex ? "noindex, nofollow" : "index, follow");
    updateMeta("author", "Gatinhas Club");
    updateMeta("viewport", "width=device-width, initial-scale=1.0");

    updateMeta("geo.region", "BR-AP");
    updateMeta("geo.placename", "Macapá, Amapá, Brasil");
    updateMeta("geo.position", "-0.0356;-51.0705");
    updateMeta("ICBM", "-0.0356, -51.0705");
    updateMeta("language", "pt-BR");

    if (canonicalUrl) {
      let canonical = document.querySelector("link[rel='canonical']") as HTMLLinkElement;
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.rel = "canonical";
        document.head.appendChild(canonical);
      }
      canonical.href = canonicalUrl;
    }

    updateMeta("og:title", fullTitle, true);
    updateMeta("og:description", description, true);
    updateMeta("og:type", ogType, true);
    if (canonicalUrl) updateMeta("og:url", canonicalUrl, true);
    updateMeta("og:image", ogImageUrl, true);
    updateMeta("og:image:width", ogImageWidth.toString(), true);
    updateMeta("og:image:height", ogImageHeight.toString(), true);
    updateMeta("og:image:alt", ogImageAltText, true);
    updateMeta("og:locale", "pt_BR", true);
    updateMeta("og:site_name", "Gatinhas Club – Macapá AP", true);

    updateMeta("twitter:card", "summary_large_image");
    updateMeta("twitter:title", fullTitle);
    updateMeta("twitter:description", description);
    updateMeta("twitter:image", ogImageUrl);
    updateMeta("twitter:image:alt", ogImageAltText);
    if (twitterHandle) updateMeta("twitter:creator", twitterHandle);

    updateMeta("theme-color", "#ec4899");
    updateMeta("apple-mobile-web-app-capable", "yes");
    updateMeta("apple-mobile-web-app-status-bar-style", "black-translucent");

    if (schema) {
      let schemaScript = document.querySelector('script[type="application/ld+json"][data-schema]') as HTMLScriptElement;
      if (!schemaScript) {
        schemaScript = document.createElement("script");
        schemaScript.type = "application/ld+json";
        schemaScript.setAttribute("data-schema", "true");
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = JSON.stringify(schema);
    }

    let orgScript = document.querySelector('script[data-org-schema]') as HTMLScriptElement;
    if (!orgScript) {
      orgScript = document.createElement("script");
      orgScript.type = "application/ld+json";
      orgScript.setAttribute("data-org-schema", "true");
      document.head.appendChild(orgScript);
    }
    orgScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Gatinhas Club",
      url: siteUrl,
      logo: `${siteUrl}/logo.png`,
      description: "Plataforma de classificados adultos independentes em Macapá – AP",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Macapá",
        addressRegion: "AP",
        addressCountry: "BR",
      },
      sameAs: [
        "https://pt.wikipedia.org/wiki/Macap%C3%A1",
        "https://www.facebook.com/gatinhasclub",
        "https://www.instagram.com/gatinhasclub",
        "https://www.twitter.com/gatinhasclub",
      ],
    });
  }, [title, description, canonical, schema, ogImage, ogType, ogImageWidth, ogImageHeight, ogImageAlt, twitterHandle, noIndex, keywords, fullTitle, canonicalUrl, ogImageUrl, ogImageAltText, siteUrl]);

  return null;
};

export default SEOHead;
