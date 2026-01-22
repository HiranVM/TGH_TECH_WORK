import axios from "axios";

const API_URL = "https://dummyjson.com/products";

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  tags: string[];
  sku: string;
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: {
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
  }[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
  };
}

export interface ProductResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface Category {
  slug: string;
  name: string;
  url: string;
}

export const fetchCategories = async () => {
  const url = `${API_URL}/categories`;
  const response = await axios.get<Category[]>(url);
  return response.data;
};

export const fetchProductsByCategory = async (
  category: string,
  limit: number,
  skip: number,
  sortBy?: string,
  order?: "asc" | "desc",
) => {
  let url = `${API_URL}/category/${category}?limit=${limit}&skip=${skip}`;
  if (sortBy) {
    url += `&sortBy=${sortBy}&order=${order || "asc"}`;
  }
  const response = await axios.get<ProductResponse>(url);
  return response.data;
};

export const fetchProducts = async (
  limit: number,
  skip: number,
  sortBy?: string,
  order?: "asc" | "desc",
) => {
  let url = `${API_URL}?limit=${limit}&skip=${skip}`;
  if (sortBy) {
    url += `&sortBy=${sortBy}&order=${order || "asc"}`;
  }
  const response = await axios.get<ProductResponse>(url);
  return response.data;
};

export const searchProducts = async (
  query: string,
  limit: number,
  skip: number,
) => {
  const url = `${API_URL}/search?q=${query}&limit=${limit}&skip=${skip}`;
  const response = await axios.get<ProductResponse>(url);
  return response.data;
};

export const fetchProduct = async (id: string) => {
  const url = `${API_URL}/${id}`;
  const response = await axios.get<Product>(url);
  return response.data;
};

export const updateProduct = async (id: string, data: Partial<Product>) => {
  const url = `${API_URL}/${id}`;
  const response = await axios.put<Product>(url, data);
  return response.data;
};

export const deleteProduct = async (id: string) => {
  const url = `${API_URL}/${id}`;
  const response = await axios.delete(url);
  return response.data;
};

export const addProduct = async (data: any) => {
  const url = `${API_URL}/add`;
  const response = await axios.post<Product>(url, data);
  return response.data;
};
