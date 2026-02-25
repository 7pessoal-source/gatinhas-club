import { Helmet } from "react-helmet-async";

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
  const siteUrl = "https://gatinhasclub.com.br";
  const canonicalUrl = canonical ? `${siteUrl}${canonical}` : undefined;
  const defaultOg = `${siteUrl}/og-image.jpg`;
  const ogImageUrl = ogImage || defaultOg;
  const ogImageAltText = ogImageAlt || "Gatinhas Club – Acompanhantes em Macapá AP";

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      <meta name="author" content="Gatinhas Club" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta charSet="utf-8" />

      {/* Geo Tags */}
      <meta name="geo.region" content="BR-AP" />
      <meta name="geo.placename" content="Macapá, Amapá, Brasil" />
      <meta name="geo.position" content="-0.0356;-51.0705" />
      <meta name="ICBM" content="-0.0356, -51.0705" />
      <meta name="language" content="pt-BR" />

      {/* Canonical */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph - Complete */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:image:width" content={ogImageWidth.toString()} />
      <meta property="og:image:height" content={ogImageHeight.toString()} />
      <meta property="og:image:alt" content={ogImageAltText} />
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:site_name" content="Gatinhas Club – Macapá AP" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImageUrl} />
      <meta name="twitter:image:alt" content={ogImageAltText} />
      {twitterHandle && <meta name="twitter:creator" content={twitterHandle} />}

      {/* Additional Security & Performance Headers */}
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="theme-color" content="#ec4899" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

      {/* Schema.org Structured Data */}
      {schema && (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      )}

      {/* Default Organization Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
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
            "https://www.facebook.com/gatinhasclub",
            "https://www.instagram.com/gatinhasclub",
            "https://www.twitter.com/gatinhasclub",
          ],
        })}
      </script>
    </Helmet>
  );
};

export default SEOHead;
