import React, { useEffect, useState } from 'react';
import { ArrowLeft, Edit2, Package, MapPin, DollarSign, AlertTriangle, Calendar } from 'lucide-react';
import axios from 'axios';

interface ProductDetailsProps {
  productId: string;
  onClose: () => void;
  onEdit?: (productId: string) => void;
}

const API_URL = "https://back-end-cloud.onrender.com";

const ProductDetails: React.FC<ProductDetailsProps> = ({ productId, onClose, onEdit }) => {
  const [product, setProduct] = useState<any>(null);
  const [supplier, setSupplier] = useState<any>(null);
  const [movements, setMovements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // 1️⃣ Obtener producto
        const productRes = await axios.get(`${API_URL}/products/${productId}`);
        setProduct(productRes.data);

        // 2️⃣ Obtener proveedor
        if (productRes.data.supplierId) {
          const supplierRes = await axios.get(`${API_URL}/suppliers/${productRes.data.supplierId}`);
          setSupplier(supplierRes.data);
        }

        // 3️⃣ Movimientos del producto
        const movRes = await axios.get(`${API_URL}/movements/product/${productId}`);
        setMovements(movRes.data.slice(-10));
      } catch (err) {
        console.error("Error cargando datos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [productId]);

  if (loading) {
    return <div className="p-10 text-center text-gray-600">Cargando...</div>;
  }

  if (!product) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Producto no encontrado</p>
        <button onClick={onClose} className="mt-4 text-blue-600 hover:underline">
          Volver
        </button>
      </div>
    );
  }

  const getStockStatus = () => {
    if (product.stock === 0) return { color: 'text-red-600', label: 'Agotado', bgColor: 'bg-red-50' };
    if (product.stock <= product.minStock) return { color: 'text-orange-600', label: 'Stock Bajo', bgColor: 'bg-orange-50' };
    if (product.stock >= product.maxStock) return { color: 'text-blue-600', label: 'Stock Alto', bgColor: 'bg-blue-50' };
    return { color: 'text-green-600', label: 'Normal', bgColor: 'bg-green-50' };
  };

  const stockStatus = getStockStatus();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Detalles del Producto</h1>
            <p className="text-gray-600">Información completa del producto</p>
          </div>
        </div>

        {onEdit && (
          <button
            onClick={() => onEdit(productId)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Edit2 size={16} />
            <span>Editar</span>
          </button>
        )}
      </div>

      {/* GRID GENERAL */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* --- COLUMNA IZQUIERDA --- */}
        <div className="lg:col-span-2 space-y-6">

          {/* Card de Producto */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                <Package size={32} className="text-gray-500" />
              </div>

              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h2>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-500">SKU:</span> <span className="ml-2 font-medium">{product.sku}</span></div>
                  <div><span className="text-gray-500">Categoría:</span> <span className="ml-2 font-medium">{product.category}</span></div>
                  <div><span className="text-gray-500">Unidad:</span> <span className="ml-2 font-medium">{product.unit}</span></div>

                  <div className="flex items-center">
                    <MapPin size={16} className="text-gray-400 mr-1" />
                    <span className="text-gray-500">Ubicación:</span>
                    <span className="ml-2 font-medium">{product.location}</span>
                  </div>
                </div>
              </div>
            </div>

            {product.description && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h3 className="font-medium text-gray-900 mb-2">Descripción</h3>
                <p className="text-gray-600">{product.description}</p>
              </div>
            )}
          </div>

          {/* Stock */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Información de Stock</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

              <div className={`p-4 rounded-lg ${stockStatus.bgColor}`}>
                <div className="text-2xl font-bold">{product.stock}</div>
                <div className="text-sm text-gray-600">Stock Actual</div>
                <div className={`text-xs mt-1 ${stockStatus.color}`}>{stockStatus.label}</div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold">{product.minStock}</div>
                <div className="text-sm text-gray-600">Stock Mínimo</div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold">{product.maxStock}</div>
                <div className="text-sm text-gray-600">Stock Máximo</div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold">
                  S/ {(product.stock * product.price).toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Valor Total</div>
              </div>
            </div>

            {product.stock <= product.minStock && (
              <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-center space-x-3">
                <AlertTriangle size={20} className="text-orange-500" />
                <div>
                  <p className="text-orange-800 font-medium">Stock por debajo del mínimo</p>
                  <p className="text-orange-600 text-sm">Se recomienda realizar reposición</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- SIDEBAR DERECHA --- */}
        <div className="space-y-6">

          {/* Precio */}
          <div className="bg-white rounded-xl p-6 border shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <DollarSign size={20} className="mr-2" /> Precio
            </h3>
            <div className="text-3xl font-bold">
              S/ {Number(product.price).toFixed(2)}
            </div>
            <p className="text-sm text-gray-600 mt-1">por {product.unit}</p>
          </div>

          {/* Proveedor */}
          {supplier && (
            <div className="bg-white rounded-xl p-6 border shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Proveedor</h3>

              <p className="font-medium">{supplier.name}</p>
              <p className="text-sm text-gray-600">{supplier.contactPerson}</p>

              <div className="pt-2 border-t mt-2">
                <p className="text-sm">{supplier.email}</p>
                <p className="text-sm">{supplier.phone}</p>
              </div>
            </div>
          )}

          {/* Fechas */}
          <div className="bg-white rounded-xl p-6 border shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Calendar size={20} className="mr-2" /> Fechas
            </h3>

            <p className="text-sm font-medium">Creado</p>
            <p className="text-sm text-gray-600 mb-3">
              {new Date(product.createdAt).toLocaleString("es-PE")}
            </p>

            <p className="text-sm font-medium">Última Actualización</p>
            <p className="text-sm text-gray-600">
              {new Date(product.updatedAt).toLocaleString("es-PE")}
            </p>
          </div>
        </div>
      </div>

      {/* Movimientos */}
      <div className="lg:col-span-3 mt-6">
        <div className="bg-white rounded-xl p-6 border shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Movimientos Recientes</h3>

          {movements.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay movimientos</p>
          ) : (
            <div className="space-y-3">
              {movements.map(m => (
                <div key={m.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${m.type === "entry" ? "bg-green-500" : "bg-red-500"}`} />

                    <div>
                      <p className="font-medium">
                        {m.type === "entry" ? "Entrada" : "Salida"} - {m.quantity} {product.unit}
                      </p>
                      <p className="text-sm text-gray-600">{m.reason}</p>
                      {m.reference && <p className="text-xs text-gray-500">Ref: {m.reference}</p>}
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-600">{new Date(m.createdAt).toLocaleDateString("es-PE")}</p>
                    {m.cost && <p className="font-medium">S/ {m.cost.toFixed(2)}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default ProductDetails;
