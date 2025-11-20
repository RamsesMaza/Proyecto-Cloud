import React, { createContext, useContext, useEffect, useState } from "react";

// URL del backend
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://back-end-cloud.onrender.com";

// ---------- TIPOS ----------
export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  minStock: number;
  maxStock: number;
  supplierId: number;
  unit: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: number;
  name: string;
  email: string;
  phone: string;
  contactPerson: string;
}

export interface Movement {
  id: string;
  productId: string;
  type: "entry" | "exit";
  quantity: number;
  reason: string;
  reference?: string;
  cost?: number;
  createdAt: string;
}

// ---------- CONTEXTO ----------
interface InventoryContextType {
  products: Product[];
  suppliers: Supplier[];
  movements: Movement[];

  fetchProducts: () => Promise<void>;
  fetchSuppliers: () => Promise<void>;
  fetchMovements: () => Promise<void>;

  createProduct: (product: Product) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  searchProducts: (query: string) => Product[];
}

const InventoryContext = createContext<InventoryContextType | undefined>(
  undefined
);

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventory must be used within InventoryProvider");
  }
  return context;
};

// ---------- PROVIDER ----------
export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);

  // ---------------------------
  // 🔧 NORMALIZACIÓN DE PRODUCTOS
  // ---------------------------
  const normalizeProduct = (p: any): Product => ({
    ...p,
    price: Number(p.price),
    stock: Number(p.stock),
    minStock: Number(p.minStock),
    maxStock: Number(p.maxStock),
  });

  // ---------------------------
  // 🔥 GET PRODUCTS
  // ---------------------------
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/products`);
      const data = await res.json();

      setProducts(data.map(normalizeProduct)); // FIX ✔
    } catch (error) {
      console.error("Error cargando productos:", error);
    }
  };

  // ---------------------------
  // 🔥 GET SUPPLIERS
  // ---------------------------
  const fetchSuppliers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/suppliers`);
      const data = await res.json();
      setSuppliers(data);
    } catch (error) {
      console.error("Error cargando proveedores:", error);
    }
  };

  // ---------------------------
  // 🔥 GET MOVEMENTS
  // ---------------------------
  const fetchMovements = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/movements`);
      const data = await res.json();
      setMovements(data);
    } catch (error) {
      console.error("Error cargando movimientos:", error);
    }
  };

  // ---------------------------
  // 🔥 CREATE PRODUCT
  // ---------------------------
  const createProduct = async (product: Product) => {
    try {
      const res = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (!res.ok) throw new Error("Error creando producto");

      await fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  // ---------------------------
  // 🔥 UPDATE PRODUCT
  // ---------------------------
  const updateProduct = async (id: string, product: Partial<Product>) => {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (!res.ok) throw new Error("Error actualizando producto");

      await fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  // ---------------------------
  // 🔥 DELETE PRODUCT
  // ---------------------------
  const deleteProduct = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Error eliminando producto");

      await fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  // ---------------------------
  // 🔍 SEARCH PRODUCTS
  // ---------------------------
  const searchProducts = (query: string) => {
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  };

  // Cargar todo al inicio
  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
    fetchMovements();
  }, []);

  return (
    <InventoryContext.Provider
      value={{
        products,
        suppliers,
        movements,
        fetchProducts,
        fetchSuppliers,
        fetchMovements,
        createProduct,
        updateProduct,
        deleteProduct,
        searchProducts,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};
