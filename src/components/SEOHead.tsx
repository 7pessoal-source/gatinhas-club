import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  schema?: object;
  ogImage?: string;
  noIndex?: boolean;
}

const SEOHead = ({ title, description, canonical, schema, ogImage, noIndex = false }: SEOHeadProps) => {
  const fullTitle = title.includes("Gatinhas Club")
    ? title
    : `${title} | Gatinhas Club – Macapá AP`;
  const siteUrl = "https://gatinhasclub.com.br";
  const canonicalUrl = canonical ? `${siteUrl}${canonical}` : undefined;
  const defaultOg = `${siteUrl}/og-image.jpg`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      <meta name="author" content="Gatinhas Club" />
      <meta name="geo.region" content="BR-AP" />
      <meta name="geo.placename" content="Macapá, Amapá, Brasil" />
      <meta name="geo.position" content="-0.0356;-51.0705" />
      <meta name="ICBM" content="-0.0356, -51.0705" />
      <meta name="language" content="pt-BR" />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:image" content={ogImage || defaultOg} />
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:site_name" content="Gatinhas Club – Macapá AP" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage || defaultOg} />

      {/* Schema */}
      {schema && (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      )}
    </Helmet>
  );
};

export default SEOHead;
