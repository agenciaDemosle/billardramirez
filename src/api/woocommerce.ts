import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type {
  Product,
  Category,
  OrderData,
  PaymentGateway,
  ProductVariation,
} from '../types/product';

interface WooCommerceParams {
  per_page?: number;
  page?: number;
  search?: string;
  category?: string;
  orderby?: string;
  order?: 'asc' | 'desc';
  min_price?: string;
  max_price?: string;
  on_sale?: boolean;
  featured?: boolean;
  [key: string]: any;
}

class WooCommerceAPI {
  private baseURL: string;
  private consumerKey: string;
  private consumerSecret: string;
  private client: AxiosInstance;

  constructor() {
    // En desarrollo, usar el proxy de Vite para evitar problemas de CORS
    const isDevelopment = import.meta.env.DEV;

    this.baseURL = isDevelopment ? '/api/wc' : (import.meta.env.VITE_WOO_URL || '');
    this.consumerKey = import.meta.env.VITE_WOO_CONSUMER_KEY || '';
    this.consumerSecret = import.meta.env.VITE_WOO_CONSUMER_SECRET || '';

    // Configuración del cliente
    const clientConfig: any = {
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Solo agregar auth si NO estamos en desarrollo (el proxy lo maneja)
    if (!isDevelopment) {
      clientConfig.auth = {
        username: this.consumerKey,
        password: this.consumerSecret,
      };
    }

    this.client = axios.create(clientConfig);
  }

  /**
   * Get all products with optional filters
   */
  async getProducts(params: WooCommerceParams = {}): Promise<Product[]> {
    try {
      const defaultParams = {
        per_page: 12,
        page: 1,
        status: 'publish',
        ...params,
      };

      const response = await this.client.get<Product[]>('/products', {
        params: defaultParams,
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  /**
   * Get a single product by ID
   */
  async getProduct(id: number): Promise<Product> {
    try {
      const response = await this.client.get<Product>(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get a single product by slug
   */
  async getProductBySlug(slug: string): Promise<Product> {
    try {
      const response = await this.client.get<Product[]>('/products', {
        params: { slug },
      });

      if (response.data.length === 0) {
        throw new Error(`Product with slug "${slug}" not found`);
      }

      return response.data[0];
    } catch (error) {
      console.error(`Error fetching product by slug ${slug}:`, error);
      throw error;
    }
  }

  /**
   * Get product variations
   */
  async getProductVariations(
    productId: number
  ): Promise<ProductVariation[]> {
    try {
      const response = await this.client.get<ProductVariation[]>(
        `/products/${productId}/variations`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching variations for product ${productId}:`, error);
      throw error;
    }
  }

  /**
   * Get all product categories
   */
  async getCategories(params: WooCommerceParams = {}): Promise<Category[]> {
    try {
      const defaultParams = {
        per_page: 100,
        hide_empty: true,
        ...params,
      };

      const response = await this.client.get<Category[]>('/products/categories', {
        params: defaultParams,
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  /**
   * Get a single category by ID
   */
  async getCategory(id: number): Promise<Category> {
    try {
      const response = await this.client.get<Category>(
        `/products/categories/${id}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      throw error;
    }
  }

  /**
   * Search products
   */
  async searchProducts(query: string, params: WooCommerceParams = {}): Promise<Product[]> {
    try {
      return await this.getProducts({
        search: query,
        ...params,
      });
    } catch (error) {
      console.error(`Error searching products with query "${query}":`, error);
      throw error;
    }
  }

  /**
   * Get featured products
   */
  async getFeaturedProducts(limit = 8): Promise<Product[]> {
    try {
      return await this.getProducts({
        featured: true,
        per_page: limit,
      });
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  }

  /**
   * Get products on sale
   */
  async getOnSaleProducts(limit = 12): Promise<Product[]> {
    try {
      return await this.getProducts({
        on_sale: true,
        per_page: limit,
      });
    } catch (error) {
      console.error('Error fetching products on sale:', error);
      throw error;
    }
  }

  /**
   * Get products by category
   */
  async getProductsByCategory(
    categoryId: number,
    params: WooCommerceParams = {}
  ): Promise<Product[]> {
    try {
      return await this.getProducts({
        category: categoryId.toString(),
        ...params,
      });
    } catch (error) {
      console.error(`Error fetching products for category ${categoryId}:`, error);
      throw error;
    }
  }

  /**
   * Create an order
   */
  async createOrder(orderData: OrderData): Promise<any> {
    try {
      const response = await this.client.post('/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  /**
   * Get payment gateways
   */
  async getPaymentGateways(): Promise<PaymentGateway[]> {
    try {
      // Intentar obtener todos los gateways, incluyendo los de plugins
      const response = await this.client.get<PaymentGateway[]>('/payment_gateways', {
        params: {
          _fields: 'id,title,description,enabled,method_title,method_description',
        }
      });

      console.log('=== DEBUG PAYMENT GATEWAYS ===');
      console.log('URL completa:', this.baseURL + '/payment_gateways');
      console.log('Total de gateways devueltos:', response.data.length);
      console.log('Gateways:', response.data);
      console.log('Headers:', response.headers);
      console.log('================================');

      // Por ahora devolver todos sin filtrar
      return response.data;
    } catch (error) {
      console.error('Error fetching payment gateways:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data);
        console.error('Response status:', error.response?.status);
      }
      throw error;
    }
  }

  /**
   * Get order by ID
   */
  async getOrder(orderId: number): Promise<any> {
    try {
      const response = await this.client.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching order ${orderId}:`, error);
      throw error;
    }
  }

  /**
   * Get customization price (laser engraving)
   */
  async getCustomizationPrice(): Promise<{ price: number; formatted: string }> {
    try {
      const isDevelopment = import.meta.env.DEV;
      const baseURL = isDevelopment ? '' : import.meta.env.VITE_WOO_URL || '';

      const response = await axios.get(`${baseURL}/wp-json/billard/v1/customization/laser-price`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customization price:', error);
      // Valor por defecto en caso de error
      return {
        price: 10000,
        formatted: '$10.000'
      };
    }
  }
}

export const wooApi = new WooCommerceAPI();
