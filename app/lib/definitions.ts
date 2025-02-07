export type User = {
  email: string;
  name: string;
  id: string;
  password: string;
  role: string;
};

export type CarState = {
  id: string;
  name: string;
  brand: Brand;
  category: { id: string; name: string; price: number };
  price: number;
  image: string;
  description: string;
  addons: { addonId: string; addonName: string }[];
  features: { featureName: string; featureValue: string }[];
};

export type CarActionState = {
  errors?: {
    name?: string[];
    brand?: string[];
    category?: string[];
    price?: string[];
    image?: string[];
    description?: string[];
    addons?: string[];
    features?: string[];
  };
  state_error?: string | null;
  message?: string | null;
};

export type CategoryState = {
  id: string;
  name: string;
  brands: Brand[];
  price: number;
  image: string;
  description: string;
};

export type Brand = {
  brandId: string;
  brandName: string;
};

export type CategoryActionState = {
  errors?: {
    name?: string[];
    brand?: string[];
    price?: string[];
    image?: string[];
    description?: string[];
  };
  state_error?: string | null;
  message?: string | null;
};

export type BookingState = {
  id: string;
  userId: string;
  userName: string;
  phone: string;
  carId: string;
  carName: string;
  bookingDate: string;
  amount: number;
  departure: string;
  destination: string;
  paymentStatus: string;
  bookType: string;
  paymentType: string;
  bookingStatus: string;
  createdAt: string;
};

export type TransactionState = {
  id: string;
  amount: number;
  reference: string;
  destination: string;
  status: string;
  bookId: string;
  createdAt: string;
};
