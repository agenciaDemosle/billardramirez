import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Analytics event types
export type AnalyticsEvent = {
  action: string;
  category: string;
  label?: string;
  value?: number;
};

// Declare dataLayer type
declare global {
  interface Window {
    dataLayer: any[];
  }
}

// Helper function to clean dataLayer before pushing new events
// This prevents contamination between events
function cleanDataLayer() {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      // Clean all custom parameters
      event: undefined,
      event_category: undefined,
      event_label: undefined,

      // Page tracking
      page_path: undefined,
      page_title: undefined,
      page_type: undefined,

      // E-commerce tracking
      product_name: undefined,
      product_id: undefined,
      product_ids: undefined,
      product_category: undefined,
      product_price: undefined,
      num_items: undefined,

      // Cart tracking
      cart_total: undefined,
      cart_items: undefined,

      // CTA tracking
      cta_text: undefined,
      cta_location: undefined,
      cta_type: undefined,
      button_text: undefined,

      // Click tracking
      click_location: undefined,

      // Value tracking
      value: undefined,
      currency: undefined,

      // Form tracking
      form_name: undefined,
      step_number: undefined,
      step_name: undefined,

      // Contact tracking
      service_interested: undefined,

      // Outbound tracking
      outbound_url: undefined,
      link_text: undefined,

      // Scroll & Engagement tracking
      scroll_depth: undefined,
      scroll_percentage: undefined,
      section_name: undefined,
      visibility_percentage: undefined,
      engagement_time: undefined,

      // Hash navigation
      hash_change: undefined,

      // Event ID (for Meta deduplication)
      event_id: undefined,
    });
  }
}

// Track page views
export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    cleanDataLayer();

    // Determine page type based on pathname
    let pageType = 'home';

    if (location.pathname === '/') {
      pageType = 'home';
    } else if (location.pathname.includes('producto')) {
      pageType = 'product';
    } else if (location.pathname.includes('carrito')) {
      pageType = 'cart';
    } else if (location.pathname.includes('checkout')) {
      pageType = 'checkout';
    } else if (location.pathname.includes('contacto')) {
      pageType = 'contact';
    }

    // When GTM/GA4 is implemented, this will fire page_view events
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'page_view',
        page_path: location.pathname + location.search + location.hash,
        page_title: document.title,
        page_type: pageType,
      });
    }

    // Console log for development
    // console.log('📊 Page View:', location.pathname, '| Type:', pageType);
  }, [location]);
}

// Track hash changes (section navigation)
export function useHashChangeTracking() {
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        cleanDataLayer();

        if (typeof window !== 'undefined' && window.dataLayer) {
          window.dataLayer.push({
            event: 'hash_change',
            section_name: hash,
          });
        }

        // console.log('🔗 Hash Change:', hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
}

// Track custom events with dataLayer cleanup
export function trackEvent({ action, category, label, value }: AnalyticsEvent) {
  cleanDataLayer();

  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: action,
      event_category: category,
      event_label: label,
      value: value,
    });
  }

  // Console log for development
  // console.log('📊 Event:', { action, category, label, value });
}

// ============================================
// E-COMMERCE EVENTS
// ============================================

// Track product view
export async function trackViewContent(params: {
  product_id: string;
  product_name: string;
  product_category: string;
  product_price: number;
  item_list_name?: string;
  item_list_id?: string;
  index?: number;
}) {
  cleanDataLayer();

  // Generar event_id único para deduplicación
  const eventId = generateEventId();

  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'view_content',
      // GA4 format
      ecommerce: {
        items: [{
          item_id: params.product_id,
          item_name: params.product_name,
          item_category: params.product_category,
          price: params.product_price,
          quantity: 1,
          ...(params.item_list_name && { item_list_name: params.item_list_name }),
          ...(params.item_list_id && { item_list_id: params.item_list_id }),
          ...(params.index !== undefined && { index: params.index }),
        }]
      },
      // Meta Pixel format (backwards compatible)
      product_id: params.product_id,
      product_name: params.product_name,
      product_category: params.product_category,
      value: params.product_price,
      currency: 'CLP',
      event_id: eventId,
      // List context
      ...(params.item_list_name && { item_list_name: params.item_list_name }),
      ...(params.item_list_id && { item_list_id: params.item_list_id }),
      ...(params.index !== undefined && { index: params.index }),
    });
  }

  // Enviar a Meta CAPI
  await sendToMetaCAPI({
    eventName: 'ViewContent',
    eventId: eventId,
    customData: {
      content_name: params.product_name,
      content_ids: [params.product_id],
      content_type: 'product',
      content_category: params.product_category,
      value: params.product_price,
      currency: 'CLP',
    },
  });

  // console.log('👁️ View Content:', params);
}

// Track add to cart
export async function trackAddToCart(params: {
  product_id: string;
  product_name: string;
  product_category: string;
  product_price: number;
  quantity?: number;
  item_list_name?: string;
  item_list_id?: string;
  index?: number;
}) {
  cleanDataLayer();

  // Generar event_id único para deduplicación
  const eventId = generateEventId();
  const quantity = params.quantity || 1;

  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'add_to_cart',
      // GA4 format
      ecommerce: {
        items: [{
          item_id: params.product_id,
          item_name: params.product_name,
          item_category: params.product_category,
          price: params.product_price,
          quantity: quantity,
          ...(params.item_list_name && { item_list_name: params.item_list_name }),
          ...(params.item_list_id && { item_list_id: params.item_list_id }),
          ...(params.index !== undefined && { index: params.index }),
        }]
      },
      // Meta Pixel format (backwards compatible)
      product_id: params.product_id,
      product_name: params.product_name,
      product_category: params.product_category,
      value: params.product_price * quantity,
      currency: 'CLP',
      quantity: quantity,
      event_id: eventId,
      // List context
      ...(params.item_list_name && { item_list_name: params.item_list_name }),
      ...(params.item_list_id && { item_list_id: params.item_list_id }),
      ...(params.index !== undefined && { index: params.index }),
    });
  }

  // Enviar a Meta CAPI
  await sendToMetaCAPI({
    eventName: 'AddToCart',
    eventId: eventId,
    customData: {
      content_name: params.product_name,
      content_ids: [params.product_id],
      content_type: 'product',
      content_category: params.product_category,
      value: params.product_price,
      currency: 'CLP',
    },
  });

  // console.log('🛒 Add to Cart:', params);
}

// Track initiate checkout
export async function trackInitiateCheckout(params: {
  cart_total: number;
  num_items: number;
  product_ids?: string[];
  items?: Array<{
    item_id: string;
    item_name: string;
    item_category?: string;
    price: number;
    quantity: number;
  }>;
}) {
  cleanDataLayer();

  // Generar event_id único para deduplicación
  const eventId = generateEventId();

  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'initiate_checkout',
      // GA4 format
      ecommerce: {
        items: params.items || []
      },
      // Meta Pixel format (backwards compatible)
      value: params.cart_total,
      currency: 'CLP',
      num_items: params.num_items,
      product_ids: params.product_ids || [],
      event_id: eventId,
    });
  }

  // Enviar a Meta CAPI
  await sendToMetaCAPI({
    eventName: 'InitiateCheckout',
    eventId: eventId,
    customData: {
      content_name: 'checkout_initiated',
      num_items: params.num_items,
      value: params.cart_total,
      currency: 'CLP',
    },
  });

  // console.log('💳 Initiate Checkout:', params);
}

// Track purchase
export async function trackPurchase(params: {
  transaction_id: string;
  value: number;
  num_items: number;
  product_ids: string[];
  product_names?: string[];
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  items?: Array<{
    item_id: string;
    item_name: string;
    item_category?: string;
    price: number;
    quantity: number;
  }>;
}) {
  cleanDataLayer();

  // Generar event_id único para deduplicación
  const eventId = generateEventId();

  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'purchase',
      // GA4 format
      ecommerce: {
        transaction_id: params.transaction_id,
        value: params.value,
        currency: 'CLP',
        items: params.items || []
      },
      // Meta Pixel format (backwards compatible)
      transaction_id: params.transaction_id,
      value: params.value,
      currency: 'CLP',
      num_items: params.num_items,
      product_ids: params.product_ids,
      event_id: eventId,
    });
  }

  // Enviar a Meta CAPI
  await sendToMetaCAPI({
    eventName: 'Purchase',
    eventId: eventId,
    email: params.email,
    phone: params.phone,
    firstName: params.firstName,
    lastName: params.lastName,
    customData: {
      content_name: params.product_names?.join(', ') || 'Purchase',
      content_ids: params.product_ids,
      num_items: params.num_items,
      value: params.value,
      currency: 'CLP',
    },
  });

  // console.log('💰 Purchase:', params);
}

// ============================================
// POOL TABLE QUOTATION EVENTS
// ============================================

// Track pool table quote start
export function trackPoolTableQuoteStart(params: {
  table_type: string;              // profesional | recreacional
  location: string;                // hero | product_page | category
}) {
  cleanDataLayer();

  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'pool_table_quote_start',
      table_type: params.table_type,
      quote_location: params.location,
      quote_step: 1,
      quote_step_name: 'table_type_selection',
    });
  }

  // console.log('🎱 Pool Table Quote Start:', params);
}

// Track pool table customization
export function trackPoolTableCustomization(params: {
  table_type: string;
  customization_type: string;      // dimensions | cloth_color | accessories
  customization_value: string;
  customization_price?: number;
}) {
  cleanDataLayer();

  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'pool_table_customization',
      table_type: params.table_type,
      customization_type: params.customization_type,
      customization_value: params.customization_value,
      customization_price: params.customization_price || 0,
      currency: 'CLP',
    });
  }

  // console.log('🎨 Pool Table Customization:', params);
}

// Track pool table quote complete
export async function trackPoolTableQuoteComplete(params: {
  table_type: string;
  dimensions?: string;
  cloth_color?: string;
  accessories?: string[];
  estimated_value: number;
  contact_method: 'whatsapp' | 'email' | 'phone';
}) {
  cleanDataLayer();

  const eventId = generateEventId();

  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'pool_table_quote_complete',
      table_type: params.table_type,
      dimensions: params.dimensions,
      cloth_color: params.cloth_color,
      accessories: params.accessories || [],
      accessories_count: params.accessories?.length || 0,
      estimated_value: params.estimated_value,
      currency: 'CLP',
      contact_method: params.contact_method,
      quote_step: 'final',
      quote_step_name: 'quote_completed',
      event_id: eventId,
    });
  }

  // Track as Lead in Meta CAPI
  await sendToMetaCAPI({
    eventName: 'Lead',
    eventId: eventId,
    customData: {
      content_name: `Pool Table Quote - ${params.table_type}`,
      content_category: 'pool_table_customization',
      value: params.estimated_value,
      currency: 'CLP',
    },
  });

  // console.log('✅ Pool Table Quote Complete:', params);
}

// ============================================
// CONVERSION EVENTS
// ============================================

// Track WhatsApp click (PRIMARY CONVERSION)
export async function trackWhatsAppClick(params: {
  click_location: string;
  button_text?: string;
  service_interested?: string;
  value?: number;
}) {
  cleanDataLayer();

  // Generar event_id único para deduplicación
  const eventId = generateEventId();

  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'whatsapp_click',
      click_location: params.click_location,
      button_text: params.button_text || 'WhatsApp',
      service_interested: params.service_interested || 'general',
      value: params.value || 0,
      currency: 'CLP',
      event_id: eventId,
    });
  }

  // Enviar a Meta CAPI
  await sendToMetaCAPI({
    eventName: 'Contact',
    eventId: eventId,
    customData: {
      content_name: params.click_location,
      content_category: params.service_interested || 'general',
      value: params.value || 0,
      currency: 'CLP',
    },
  });

  // console.log('💬 WhatsApp Click:', params);
}

// Track phone click
export async function trackPhoneClick(clickLocation: string, buttonText?: string) {
  cleanDataLayer();

  // Generar event_id único para deduplicación
  const eventId = generateEventId();

  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'phone_click',
      click_location: clickLocation,
      button_text: buttonText || 'Llamar',
      event_id: eventId,
    });
  }

  // Enviar a Meta CAPI
  await sendToMetaCAPI({
    eventName: 'Contact',
    eventId: eventId,
    customData: {
      content_name: clickLocation,
      content_category: 'phone_call',
    },
  });

  // console.log('📞 Phone Click:', clickLocation);
}

// Track contact form submission (SECONDARY CONVERSION)
export async function trackContactSubmit(params: {
  form_name: string;
  service_interested?: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
}) {
  cleanDataLayer();

  // Generar event_id único para deduplicación
  const eventId = generateEventId();

  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'contact_submit',
      form_name: params.form_name,
      service_interested: params.service_interested || 'general',
      event_id: eventId,
    });
  }

  // Enviar a Meta CAPI
  await sendToMetaCAPI({
    eventName: 'Lead',
    eventId: eventId,
    email: params.email,
    phone: params.phone,
    firstName: params.firstName,
    lastName: params.lastName,
    customData: {
      content_name: params.form_name,
      content_category: params.service_interested || 'general',
    },
  });

  // console.log('📝 Contact Submit:', params);
}

// ============================================
// CTA EVENTS
// ============================================

// Track CTA click
export function trackCTAClick(
  ctaText: string,
  ctaLocation: string,
  ctaType: string = 'primary'
) {
  cleanDataLayer();

  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'cta_click',
      cta_text: ctaText,
      button_text: ctaText,
      cta_location: ctaLocation,
      click_location: ctaLocation,
      cta_type: ctaType,
    });
  }

  // console.log('🔘 CTA Click:', { ctaText, ctaLocation, ctaType });
}

// ============================================
// OUTBOUND LINK TRACKING
// ============================================

// Track outbound click
export function trackOutboundClick(url: string, linkText: string = '') {
  cleanDataLayer();

  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'outbound_click',
      outbound_url: url,
      link_text: linkText,
      button_text: linkText,
    });
  }

  // console.log('🔗 Outbound Click:', { url, linkText });
}

// ============================================
// SCROLL TRACKING
// ============================================

// Track scroll depth
export function trackScrollDepth(scrollPercentage: number) {
  cleanDataLayer();

  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'scroll_depth',
      scroll_percentage: scrollPercentage,
      scroll_depth: `${scrollPercentage}%`,
    });
  }

  // console.log('📜 Scroll Depth:', scrollPercentage + '%');
}

// Hook for scroll tracking (25%, 50%, 75%, 100%)
export function useScrollTracking() {
  useEffect(() => {
    const scrollThresholds = [25, 50, 75, 100];
    const triggered = new Set<number>();

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const scrollPercentage = Math.round((scrolled / scrollHeight) * 100);

      scrollThresholds.forEach((threshold) => {
        if (scrollPercentage >= threshold && !triggered.has(threshold)) {
          triggered.add(threshold);
          trackScrollDepth(threshold);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
}

// ============================================
// SECTION VISIBILITY TRACKING
// ============================================

// Track section view
export function trackSectionView(sectionName: string, visibilityPercentage: number = 100) {
  cleanDataLayer();

  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'section_view',
      section_name: sectionName,
      section: sectionName,
      visibility_percentage: visibilityPercentage,
    });
  }

  // console.log('👁️ Section View:', sectionName, '|', visibilityPercentage + '%');
}

// Hook for section visibility tracking using Intersection Observer
// AUTO-DETECTS all sections with ID and tracks them automatically
export function useAutoSectionVisibility() {
  useEffect(() => {
    const tracked = new Set<string>();

    const observerOptions = {
      threshold: [0.5], // Track when 50% of section is visible
      rootMargin: '0px',
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          const sectionId = entry.target.id;
          if (sectionId && !tracked.has(sectionId)) {
            tracked.add(sectionId);
            const visibilityPercentage = Math.round(entry.intersectionRatio * 100);
            trackSectionView(sectionId, visibilityPercentage);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Auto-detect all sections with ID
    const selectors = [
      'section[id]',
      'div[id="hero"]',
      'div[id="productos"]',
      'div[id="nosotros"]',
      'div[id="contacto"]',
    ];

    const sections = document.querySelectorAll(selectors.join(', '));
    sections.forEach((section) => {
      if (section.id) {
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, []);
}

// Manual version (if you want to specify specific sections)
export function useSectionVisibility(sectionRefs: { [key: string]: HTMLElement | null }) {
  useEffect(() => {
    const tracked = new Set<string>();

    const observerOptions = {
      threshold: [0.5], // Track when 50% of section is visible
      rootMargin: '0px',
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          const sectionId = entry.target.id;
          if (sectionId && !tracked.has(sectionId)) {
            tracked.add(sectionId);
            const visibilityPercentage = Math.round(entry.intersectionRatio * 100);
            trackSectionView(sectionId, visibilityPercentage);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all sections
    Object.values(sectionRefs).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [sectionRefs]);
}

// ============================================
// ENGAGEMENT TIME TRACKING
// ============================================

// Track engagement time (time spent on page)
export function trackEngagementTime(timeInSeconds: number) {
  cleanDataLayer();

  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'engagement_time',
      engagement_time: timeInSeconds,
    });
  }

  // console.log('⏱️ Engagement Time:', timeInSeconds + 's');
}

// Hook for engagement time tracking
export function useEngagementTime() {
  useEffect(() => {
    const startTime = Date.now();
    const intervals = [10, 30, 60, 120, 300]; // 10s, 30s, 1min, 2min, 5min
    const triggered = new Set<number>();

    const checkEngagement = setInterval(() => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);

      intervals.forEach((interval) => {
        if (timeSpent >= interval && !triggered.has(interval)) {
          triggered.add(interval);
          trackEngagementTime(interval);
        }
      });
    }, 1000);

    return () => clearInterval(checkEngagement);
  }, []);
}

// ============================================
// META CONVERSIONS API (CAPI)
// ============================================

// Helper: Generate unique event ID for deduplication
function generateEventId(): string {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

// Helper: Hash data for Meta CAPI (SHA-256)
async function hashSHA256(data: string): Promise<string> {
  if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
    return data; // Fallback si no hay crypto API
  }

  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data.toLowerCase().trim());
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Send event to Meta CAPI via PHP endpoint
export async function sendToMetaCAPI(params: {
  eventName: string;
  eventId?: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  eventSourceUrl?: string;
  customData?: Record<string, any>;
}) {
  try {
    const {
      eventName,
      eventId,
      email,
      phone,
      firstName,
      lastName,
      eventSourceUrl,
      customData = {},
    } = params;

    // Hashear datos sensibles
    const userData: Record<string, string> = {};

    if (email) {
      userData.em = await hashSHA256(email);
    }

    if (phone) {
      // Remover caracteres no numéricos antes de hashear
      const cleanPhone = phone.replace(/\D/g, '');
      userData.ph = await hashSHA256(cleanPhone);
    }

    if (firstName) {
      userData.fn = await hashSHA256(firstName);
    }

    if (lastName) {
      userData.ln = await hashSHA256(lastName);
    }

    // Agregar fbp (Facebook Browser ID) y fbc (Facebook Click ID) si existen
    const fbp = getCookie('_fbp');
    const fbc = getCookie('_fbc');

    if (fbp) {
      userData.fbp = fbp;
    }

    if (fbc) {
      userData.fbc = fbc;
    }

    // Construir evento
    const event: Record<string, any> = {
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_source_url: eventSourceUrl || window.location.href,
      action_source: 'website',
      user_data: userData,
      custom_data: customData,
    };

    // Agregar event_id si existe (para deduplicación)
    if (eventId) {
      event.event_id = eventId;
    }

    // Endpoint CAPI (ajustar según tu dominio)
    const capiEndpoint = import.meta.env.VITE_CAPI_ENDPOINT || '/api/capi.php';

    // Enviar a servidor PHP
    const response = await fetch(capiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: [event],
      }),
    });

    const result = await response.json();

    if (result.success) {
      // console.log('✅ CAPI Event Sent:', eventName, '|', result.events_received, 'events');
    } else {
      // console.error('❌ CAPI Error:', result.error);
    }

    return result;
  } catch (error) {
    // console.error('❌ CAPI Send Failed:', error);
    return { success: false, error: 'Network error' };
  }
}

// Helper: Get cookie value
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }

  return null;
}

// ============================================
// CUSTOM HOOK
// ============================================

// Custom hook for analytics
// AUTO-TRACKS: page views, scroll depth, engagement time, section visibility, hash changes
export function useAnalytics() {
  usePageTracking();           // Auto-track page views
  useScrollTracking();          // Auto-track scroll depth (25%, 50%, 75%, 100%)
  useEngagementTime();          // Auto-track engagement time (10s, 30s, 1min, 2min, 5min)
  useAutoSectionVisibility();   // Auto-track section visibility (all sections with ID)
  useHashChangeTracking();      // Auto-track hash changes

  return {
    // Core
    trackEvent,
    cleanDataLayer,

    // E-commerce
    trackViewContent,
    trackAddToCart,
    trackInitiateCheckout,
    trackPurchase,

    // Conversions
    trackWhatsAppClick,
    trackPhoneClick,
    trackContactSubmit,

    // Engagement
    trackCTAClick,

    // Outbound
    trackOutboundClick,

    // Scroll & Visibility
    trackScrollDepth,
    trackSectionView,
    trackEngagementTime,

    // Meta CAPI
    sendToMetaCAPI,

    // Hooks
    useScrollTracking,
    useSectionVisibility,
    useAutoSectionVisibility,
    useHashChangeTracking,
    useEngagementTime,
  };
}
