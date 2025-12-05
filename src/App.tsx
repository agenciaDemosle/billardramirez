import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';

// Layout
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import CartDrawer from './components/layout/CartDrawer';
import WhatsAppButton from './components/layout/WhatsAppButton';
import ScrollToTop from './components/ScrollToTop';
import Snowfall from './components/home/Snowfall';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductPage from './pages/ProductPage';
import Checkout from './pages/Checkout';
import Contact from './pages/Contact';
import Quote from './pages/Quote';
import MesasPool from './pages/MesasPool';
import Accesorios from './pages/Accesorios';
import Contacto from './pages/Contacto';
import AtencionCliente from './pages/AtencionCliente';
import PoliticasEnvio from './pages/PoliticasEnvio';
import Devoluciones from './pages/Devoluciones';
import Garantia from './pages/Garantia';
import TerminosCondiciones from './pages/TerminosCondiciones';
import PoliticaPrivacidad from './pages/PoliticaPrivacidad';
import ProcessingPayment from './pages/ProcessingPayment';
import OrderConfirmed from './pages/OrderConfirmed';
import VerifyingPayment from './pages/VerifyingPayment';
import NotFound from './pages/NotFound';

// Create QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ScrollToTop />
          {/* Copos de nieve navideños en toda la página */}
          <Snowfall />
          <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/tienda" element={<Shop />} />
                <Route path="/producto/:slug" element={<ProductPage />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/contacto" element={<Contacto />} />
                <Route path="/cotizador" element={<Quote />} />

                {/* Categorías de Productos */}
                <Route path="/mesas-de-pool" element={<MesasPool />} />
                <Route path="/accesorios" element={<Accesorios />} />

                {/* Páginas de Información */}
                <Route path="/atencion-cliente" element={<AtencionCliente />} />
                <Route path="/politicas-envio" element={<PoliticasEnvio />} />
                <Route path="/devoluciones" element={<Devoluciones />} />
                <Route path="/garantia" element={<Garantia />} />

                {/* Páginas Legales */}
                <Route path="/terminos-condiciones" element={<TerminosCondiciones />} />
                <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />

                {/* Páginas de Pago */}
                <Route path="/procesando-pago" element={<ProcessingPayment />} />
                <Route path="/verificando-pago" element={<VerifyingPayment />} />
                <Route path="/pedido-confirmado" element={<OrderConfirmed />} />

                {/* 404 Not Found */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>

            <Footer />
            <CartDrawer />
            <WhatsAppButton />
          </div>

          {/* Toast Notifications */}
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 2000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
