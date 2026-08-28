export interface Product {
  id: string;
  sku: string;
  name: string;
  unit: string;
  price: number;
  costPrice: number;
  stockQuantity: number;
  categoryName?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  notes?: string;
}

export interface Employee {
  id: string;
  employeeCode: string;
  fullName: string;
  role: string;
  baseSalary: number;
  status: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  tableName: string;
  status: string;
  paymentStatus: string;
  finalAmount: number;
  createdAt: string;
}
