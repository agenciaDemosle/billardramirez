export interface QuoteFormData {
  name: string
  email: string
  phone: string
  model: string
  tableCloth: string
  woodFinish: string
  accessories: string[]
  region: string
  message?: string
}

export interface TableModel {
  id: string
  name: string
  size: string
  price?: string
  features: string[]
  image: string
  featured?: boolean
}

export interface Testimonial {
  id: number
  name: string
  location: string
  rating: number
  text: string
}
