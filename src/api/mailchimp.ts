/**
 * Mailchimp API Service
 * Integración con Mailchimp usando el endpoint PHP personalizado
 */

const MAILCHIMP_ENDPOINT = 'https://billardramirez.cl/api/mailchimp/subscribe.php';

export interface MailchimpSubscribeData {
  email: string;
  productId?: number;
  productName?: string;
  tags?: string[];
  firstName?: string;
  lastName?: string;
}

export interface MailchimpResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Suscribe un email a Mailchimp usando el endpoint PHP
 */
export async function subscribeToMailchimp(
  data: MailchimpSubscribeData
): Promise<MailchimpResponse> {
  try {
    const response = await fetch(MAILCHIMP_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        productId: data.productId,
        productName: data.productName,
        tags: data.tags || [],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.success === false || result.error) {
      return {
        success: false,
        error: result.error || result.details || 'Error al suscribirse',
      };
    }

    return {
      success: true,
      message: result.message || 'Suscripción exitosa',
    };
  } catch (error) {
    console.error('Error subscribing to Mailchimp:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Suscribe a newsletter (sin producto específico)
 */
export async function subscribeToNewsletter(email: string): Promise<MailchimpResponse> {
  return subscribeToMailchimp({
    email,
    tags: ['newsletter'],
  });
}

/**
 * Suscribe para notificación de stock
 */
export async function subscribeToStockNotification(
  email: string,
  productId: number,
  productName: string
): Promise<MailchimpResponse> {
  return subscribeToMailchimp({
    email,
    productId,
    productName,
    tags: ['stock-notification'],
  });
}
