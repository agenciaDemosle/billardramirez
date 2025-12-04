import { Helmet } from 'react-helmet-async';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface ProductSEOData {
  name: string;
  description: string;
  image: string;
  price: string;
  currency?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  sku?: string;
  brand?: string;
  category?: string;
  ratingValue?: number;
  reviewCount?: number;
  images?: string[];
  condition?: 'NewCondition' | 'UsedCondition' | 'RefurbishedCondition';
  weight?: string;
  dimensions?: { width: string; height: string; depth: string };
}

interface FAQItem {
  question: string;
  answer: string;
}

interface CollectionSEOData {
  name: string;
  description: string;
  itemCount?: number;
  category?: string;
}

interface HowToStep {
  name: string;
  text: string;
  image?: string;
}

interface VideoSEOData {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration?: string;
  contentUrl?: string;
  embedUrl?: string;
}

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product' | 'profile';
  keywords?: string;
  structuredData?: object;
  noindex?: boolean;
  // Advanced SEO
  breadcrumbs?: BreadcrumbItem[];
  product?: ProductSEOData;
  faq?: FAQItem[];
  articleDate?: string;
  articleModified?: string;
  // New advanced features
  collection?: CollectionSEOData;
  howTo?: { name: string; description: string; steps: HowToStep[] };
  video?: VideoSEOData;
  speakable?: boolean;
  pageType?: 'home' | 'category' | 'product' | 'contact' | 'info' | 'checkout';
}

export default function SEO({
  title,
  description,
  canonical,
  ogImage = 'https://billardramirez.cl/images/og-image.jpg',
  ogType = 'website',
  keywords,
  structuredData,
  noindex = false,
  breadcrumbs,
  product,
  faq,
  articleDate,
  articleModified,
  collection,
  howTo,
  video,
  speakable = false,
  pageType = 'info'
}: SEOProps) {
  const siteName = 'Billard Ramirez';
  const siteUrl = 'https://billardramirez.cl';
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  const url = canonical || (typeof window !== 'undefined' ? window.location.href : siteUrl);

  // Generate Breadcrumb structured data
  const breadcrumbSchema = breadcrumbs && breadcrumbs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  } : null;

  // Generate Product structured data (enhanced)
  const productSchema = product ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    "name": product.name,
    "description": product.description,
    "image": product.images && product.images.length > 0 ? product.images : product.image,
    "brand": {
      "@type": "Brand",
      "name": product.brand || "Billard Ramirez",
      "logo": "https://billardramirez.cl/images/logo.png"
    },
    "sku": product.sku,
    "mpn": product.sku,
    "category": product.category,
    "itemCondition": `https://schema.org/${product.condition || 'NewCondition'}`,
    "offers": {
      "@type": "Offer",
      "@id": `${url}#offer`,
      "url": url,
      "priceCurrency": product.currency || "CLP",
      "price": product.price,
      "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "availability": `https://schema.org/${product.availability || 'InStock'}`,
      "itemCondition": "https://schema.org/NewCondition",
      "seller": {
        "@type": "Organization",
        "@id": "https://billardramirez.cl/#organization",
        "name": "Billard Ramirez"
      },
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0",
          "currency": "CLP"
        },
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "CL"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 3,
            "unitCode": "DAY"
          },
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": 3,
            "maxValue": 10,
            "unitCode": "DAY"
          }
        }
      },
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "applicableCountry": "CL",
        "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
        "merchantReturnDays": 30,
        "returnMethod": "https://schema.org/ReturnByMail",
        "returnFees": "https://schema.org/FreeReturn"
      }
    },
    ...(product.weight ? {
      "weight": {
        "@type": "QuantitativeValue",
        "value": product.weight,
        "unitCode": "KGM"
      }
    } : {}),
    ...(product.dimensions ? {
      "depth": { "@type": "QuantitativeValue", "value": product.dimensions.depth, "unitCode": "CMT" },
      "width": { "@type": "QuantitativeValue", "value": product.dimensions.width, "unitCode": "CMT" },
      "height": { "@type": "QuantitativeValue", "value": product.dimensions.height, "unitCode": "CMT" }
    } : {}),
    ...(product.ratingValue && product.reviewCount ? {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": product.ratingValue,
        "reviewCount": product.reviewCount,
        "bestRating": 5,
        "worstRating": 1
      }
    } : {})
  } : null;

  // Generate FAQ structured data
  const faqSchema = faq && faq.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    "mainEntity": faq.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  } : null;

  // Generate Collection/Category structured data
  const collectionSchema = collection ? {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    "name": collection.name,
    "description": collection.description,
    "url": url,
    "isPartOf": {
      "@type": "WebSite",
      "@id": "https://billardramirez.cl/#website"
    },
    "about": {
      "@type": "Thing",
      "name": collection.category || collection.name
    },
    ...(collection.itemCount ? {
      "numberOfItems": collection.itemCount
    } : {}),
    "provider": {
      "@type": "Organization",
      "@id": "https://billardramirez.cl/#organization"
    }
  } : null;

  // Generate HowTo structured data
  const howToSchema = howTo ? {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `${url}#howto`,
    "name": howTo.name,
    "description": howTo.description,
    "step": howTo.steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text,
      ...(step.image ? { "image": step.image } : {})
    }))
  } : null;

  // Generate Video structured data
  const videoSchema = video ? {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "@id": `${url}#video`,
    "name": video.name,
    "description": video.description,
    "thumbnailUrl": video.thumbnailUrl,
    "uploadDate": video.uploadDate,
    ...(video.duration ? { "duration": video.duration } : {}),
    ...(video.contentUrl ? { "contentUrl": video.contentUrl } : {}),
    ...(video.embedUrl ? { "embedUrl": video.embedUrl } : {})
  } : null;

  // Generate Speakable structured data for voice search
  const speakableSchema = speakable ? {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    "name": fullTitle,
    "description": description,
    "url": url,
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": ["h1", "h2", ".product-title", ".product-description", ".faq-question", ".faq-answer"]
    },
    "isPartOf": {
      "@type": "WebSite",
      "@id": "https://billardramirez.cl/#website"
    }
  } : null;

  // Generate page-specific WebPage schema
  const webPageSchema = pageType !== 'info' ? {
    "@context": "https://schema.org",
    "@type": pageType === 'home' ? 'WebPage' :
             pageType === 'category' ? 'CollectionPage' :
             pageType === 'product' ? 'ItemPage' :
             pageType === 'contact' ? 'ContactPage' :
             pageType === 'checkout' ? 'CheckoutPage' : 'WebPage',
    "@id": `${url}#webpage`,
    "url": url,
    "name": fullTitle,
    "description": description,
    "isPartOf": {
      "@type": "WebSite",
      "@id": "https://billardramirez.cl/#website"
    },
    "about": {
      "@type": "Organization",
      "@id": "https://billardramirez.cl/#organization"
    },
    "inLanguage": "es-CL",
    "potentialAction": {
      "@type": "ReadAction",
      "target": url
    }
  } : null;

  // Combine all structured data
  const allStructuredData = [
    structuredData,
    breadcrumbSchema,
    productSchema,
    faqSchema,
    collectionSchema,
    howToSchema,
    videoSchema,
    speakableSchema,
    webPageSchema
  ].filter(Boolean);

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Robots - Enhanced directives */}
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'} />
      <meta name="googlebot" content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'} />
      <meta name="bingbot" content={noindex ? 'noindex, nofollow' : 'index, follow'} />

      {/* Content language and audience */}
      <meta httpEquiv="content-language" content="es-CL" />
      <meta name="language" content="Spanish" />
      <meta name="audience" content="all" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />

      {/* Author and Publisher */}
      <meta name="author" content="Billard Ramirez" />
      <meta name="publisher" content="Billard Ramirez" />
      <meta name="copyright" content="Billard Ramirez" />

      {/* Mobile optimization */}
      <meta name="format-detection" content="telephone=yes" />
      <meta name="HandheldFriendly" content="true" />
      <meta name="MobileOptimized" content="width" />

      {/* Geographic Meta Tags for Local SEO */}
      <meta name="geo.region" content="CL-RM" />
      <meta name="geo.placename" content="Santiago, Región Metropolitana, Chile" />
      <meta name="geo.position" content="-33.4489;-70.6693" />
      <meta name="ICBM" content="-33.4489, -70.6693" />
      <meta name="DC.title" content={fullTitle} />
      <meta name="DC.creator" content="Billard Ramirez" />
      <meta name="DC.language" content="es-CL" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="es_CL" />

      {/* Article specific (for blog posts) */}
      {articleDate && <meta property="article:published_time" content={articleDate} />}
      {articleModified && <meta property="article:modified_time" content={articleModified} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={title} />

      {/* Product specific meta tags */}
      {product && (
        <>
          <meta property="product:price:amount" content={product.price} />
          <meta property="product:price:currency" content={product.currency || 'CLP'} />
          <meta property="og:price:amount" content={product.price} />
          <meta property="og:price:currency" content={product.currency || 'CLP'} />
          {product.availability === 'InStock' && (
            <meta property="og:availability" content="instock" />
          )}
        </>
      )}

      {/* Structured Data */}
      {allStructuredData.map((data, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  );
}

// Helper function to strip HTML tags from description
export function stripHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
}

// Helper function to truncate description
export function truncateDescription(text: string, maxLength: number = 160): string {
  if (!text) return '';
  const stripped = stripHtml(text);
  if (stripped.length <= maxLength) return stripped;
  return stripped.substring(0, maxLength - 3).trim() + '...';
}

// Helper function to format price for schema
export function formatPriceForSchema(price: string): string {
  if (!price) return '0';
  return price.replace(/[^0-9]/g, '');
}
