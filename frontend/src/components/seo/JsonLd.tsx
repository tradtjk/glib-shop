export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    name: "Golib Shop",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://golibshop.tj",
    telephone: "+992900000000",
    address: {
      "@type": "PostalAddress",
      streetAddress: "ул. Рудаки 95",
      addressLocality: "Душанбе",
      addressCountry: "TJ",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "10:00",
      closes: "21:00",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ProductJsonLd({
  name,
  description,
  sku,
  price,
  image,
  inStock,
}: {
  name: string;
  description: string;
  sku: string;
  price: number;
  image: string;
  inStock: boolean;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    sku,
    image,
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: "TJS",
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
