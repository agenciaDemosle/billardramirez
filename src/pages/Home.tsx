import Hero from '../components/home/Hero';
import FeaturedSection from '../components/home/FeaturedSection';
import ShowroomSection from '../components/home/ShowroomSection';
import SEO from '../components/SEO';

export default function Home() {

  // Schema mejorado con más datos
  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://billardramirez.cl/#website",
    "name": "Billard Ramirez",
    "alternateName": "Billard Ramirez Chile",
    "url": "https://billardramirez.cl",
    "description": "Tienda especializada en mesas de pool y accesorios de billar en Chile",
    "publisher": {
      "@id": "https://billardramirez.cl/#organization"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://billardramirez.cl/tienda?buscar={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "inLanguage": "es-CL"
  };

  // FAQ items optimizados para featured snippets
  const faqItems = [
    {
      question: "¿Cuánto cuesta una mesa de pool en Chile?",
      answer: "Los precios de mesas de pool en Chile varían según el tipo y calidad. Las mesas recreacionales con superficie de madera MDF comienzan desde $800.000 CLP, ideales para uso en el hogar. Las mesas profesionales con superficie de pizarra italiana, usadas en torneos y clubes, van desde $3.000.000 CLP. En Billard Ramirez ofrecemos opciones para todos los presupuestos con financiamiento disponible y envío a todo Chile."
    },
    {
      question: "¿Hacen envío de mesas de pool a todo Chile?",
      answer: "Sí, realizamos envíos a todo Chile, desde Arica hasta Punta Arenas. El envío de accesorios es gratis en compras sobre $100.000 CLP. Para mesas de pool, el costo de envío e instalación varía según la ubicación. En Santiago, Región Metropolitana, la instalación está incluida. Contáctanos por WhatsApp al +56 9 6583 9601 para cotizar el envío a tu ciudad."
    },
    {
      question: "¿Tienen showroom para ver las mesas de pool?",
      answer: "Sí, contamos con un showroom en Santiago donde puedes ver y probar nuestras mesas de pool antes de comprar. Estamos ubicados en Maximiliano Ibáñez 1436, Quinta Normal, Santiago. Nuestro horario de atención es: Lunes a Viernes de 9:00 a 18:00 hrs y Sábados de 10:00 a 14:00 hrs. Puedes agendar tu visita por WhatsApp."
    },
    {
      question: "¿Qué diferencia hay entre una mesa de pool profesional y una recreacional?",
      answer: "La principal diferencia está en la superficie de juego. Las mesas profesionales tienen superficie de pizarra (piedra natural) que garantiza un rebote perfecto, mayor durabilidad y es requerida en torneos oficiales. Las mesas recreacionales usan superficie de madera MDF, son más livianas, económicas y perfectas para uso casual en el hogar. Ambos tipos están disponibles en Billard Ramirez con garantía incluida."
    },
    {
      question: "¿Ofrecen garantía y servicio técnico para mesas de pool?",
      answer: "Sí, todas nuestras mesas de pool incluyen garantía que cubre defectos de fabricación. El período de garantía varía según el producto (1-3 años). Además, ofrecemos servicio técnico especializado para mantención, cambio de paño, nivelación y reparación de mesas de pool en Santiago y regiones. Contamos con más de 25 años de experiencia en el rubro."
    },
    {
      question: "¿Qué tamaño de mesa de pool necesito para mi espacio?",
      answer: "El tamaño de la mesa depende del espacio disponible. Como regla general, necesitas al menos 1.5 metros libres alrededor de la mesa para jugar cómodamente con un taco estándar. Para una mesa de 8 pies (la más popular), necesitas una sala de al menos 5x4 metros. Mesas de 7 pies requieren 4.5x3.5 metros. Contáctanos y te ayudamos a elegir el tamaño ideal para tu espacio."
    }
  ];

  // Breadcrumbs para página de inicio
  const breadcrumbs = [
    { name: 'Inicio', url: 'https://billardramirez.cl/' }
  ];

  return (
    <div>
      <SEO
        title="Billard Ramirez - Mesas de Pool Profesionales y Accesorios en Chile | Showroom Santiago"
        description="Tienda especializada en mesas de pool profesionales (pizarra) y recreacionales en Chile. Tacos, bolas, accesorios de billar y servicio técnico. Showroom en Santiago, Quinta Normal. Envío a todo Chile. Desde 1995."
        canonical="https://billardramirez.cl/"
        keywords="mesas de pool chile, mesas de billar profesionales, mesas pool recreacionales, mesa pool pizarra, mesa pool madera, accesorios pool, tacos billar, bolas pool, mesa pool precio chile, comprar mesa pool, showroom pool santiago, servicio técnico pool, billard ramirez, mesa billar santiago"
        structuredData={websiteStructuredData}
        faq={faqItems}
        breadcrumbs={breadcrumbs}
        pageType="home"
        speakable={true}
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
