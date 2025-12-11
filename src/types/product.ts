export interface Product {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  type: 'simple' | 'variable' | 'grouped' | 'external';
  status: 'publish' | 'draft' | 'pending';
  featured: boolean;
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  stock_status: 'instock' | 'outofstock' | 'onbackorder';
  stock_quantity: number | null;
  manage_stock: boolean;
  categories: ProductCategory[];
  tags: ProductTag[];
  images: ProductImage[];
  attributes: ProductAttribute[];
  variations: number[];
  average_rating: string;
  rating_count: number;
  related_ids: number[];
  date_created: string;
  date_modified: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
}

export interface ProductTag {
  id: number;
  name: string;
  slug: string;
}

export interface ProductImage {
  id: number;
  src: string;
  name: string;
  alt: string;
}

export interface ProductAttribute {
  id: number;
  name: string;
  position: number;
  visible: boolean;
  variation: boolean;
  options: string[];
}

export interface ProductVariation {
  id: number;
  attributes: {
    id: number;
    name: string;
    option: string;
  }[];
  price: string;
  regular_price: string;
  sale_price: string;
  stock_status: 'instock' | 'outofstock' | 'onbackorder';
  stock_quantity: number | null;
  image: ProductImage;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  parent: number;
  description: string;
  display: string;
  image: {
    id: number;
    src: string;
    name: string;
    alt: string;
  } | null;
  count: number;
}

export interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  sku: string;
  variationId?: number;
  variation?: {
    [key: string]: string;
  };
  categories?: { id: number; name: string; slug: string }[];
  customization?: {
    laserEngraving?: {
      enabled: boolean;
      text: string;
      price: number;
    };
    clothChange?: {
      dimensions: string;
      color: string;
      colorId: string;
      area: string;
    };
  };
}

export interface OrderData {
  payment_method: string;
  payment_method_title: string;
  set_paid: boolean;
  billing: BillingAddress;
  shipping: ShippingAddress;
  line_items: LineItem[];
  shipping_lines: ShippingLine[];
}

export interface BillingAddress {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email: string;
  phone: string;
}

export interface ShippingAddress {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

export interface LineItem {
  product_id: number;
  quantity: number;
  variation_id?: number;
  meta_data?: {
    key: string;
    value: string;
  }[];
}

export interface ShippingLine {
  method_id: string;
  method_title: string;
  total: string;
}

export interface PaymentGateway {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  method_title: string;
  method_description: string;
}
