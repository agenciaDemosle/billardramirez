import Hero from '../components/home/Hero';
import FeaturedSection from '../components/home/FeaturedSection';
import ShowroomSection from '../components/home/ShowroomSection';
import SEO from '../components/SEO';

export default function Home() {

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Billard Ramirez",
    "url": "https://billardramirez.cl",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://billardramirez.cl/tienda?buscar={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <div>
      <SEO
        title="Billard Ramirez - Mesas de Pool Profesionales y Accesorios en Chile"
        description="Expertos en mesas de pool profesionales y recreacionales en Chile. Venta de mesas de billar, accesorios, tacos, bolas y servicio técnico especializado. Envío a todo Chile."
        canonical="https://billardramirez.cl/"
        keywords="mesas de pool chile, mesas de billar profesionales, mesas pool recreacionales, accesorios pool, tacos billar, bolas pool, mesa pool precio, servicio técnico pool, billard ramirez"
        structuredData={structuredData}
      />
      {/* Hero Section */}
      <Hero />

      {/* Featured Section - Banner + Products Grid */}
      <FeaturedSection />

      {/* Showroom + Benefits Section */}
      <ShowroomSection />
    </div>
  );
}
