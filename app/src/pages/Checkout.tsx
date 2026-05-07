import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useCart } from "@/hooks/useCart";
import { trpc } from "@/providers/trpc";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  ArrowLeft,
  CheckCircle,
  Store,
} from "lucide-react";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, totalItems, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState<"cart" | "checkout" | "success">("cart");
  const [form, setForm] = useState({
    buyerName: "",
    buyerEmail: "",
    buyerPhone: "",
    buyerAddress: "",
    paymentMethod: "mercadopago" as "mercadopago" | "webpay" | "flow" | "khipu" | "paypal" | "transferencia" | "cash",
    notes: "",
  });

  const createOrder = trpc.order.create.useMutation({
    onSuccess: () => {
      clearCart();
      setStep("success");
    },
  });

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.buyerName || !form.buyerEmail || items.length === 0) return;

    createOrder.mutate({
      ...form,
      items: items.map((i) => ({
        productId: i.productId,
        productName: i.name,
        productPrice: i.price,
        quantity: i.quantity,
        entrepreneurId: i.entrepreneurId,
        entrepreneurName: i.entrepreneurName,
      })),
    });
  };

  const paymentLabels: Record<string, string> = {
    mercadopago: "MercadoPago",
    webpay: "WebPay Plus (Transbank)",
    flow: "Flow",
    khipu: "Khipu (Transferencia bancaria)",
    paypal: "PayPal",
    transferencia: "Transferencia bancaria directa",
    cash: "Pago en efectivo / Retiro",
  };

  const paymentIcons: Record<string, string> = {
    mercadopago: "💳",
    webpay: "💳",
    flow: "💳",
    khipu: "🏦",
    paypal: "🌐",
    transferencia: "🏦",
    cash: "💵",
  };

  // Group items by entrepreneur
  const groupedByEntrepreneur = items.reduce((acc, item) => {
    if (!acc[item.entrepreneurId]) {
      acc[item.entrepreneurId] = {
        name: item.entrepreneurName,
        slug: item.entrepreneurSlug,
        items: [],
      };
    }
    acc[item.entrepreneurId].items.push(item);
    return acc;
  }, {} as Record<number, { name: string; slug: string; items: typeof items }>);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="bg-blue-700 text-white py-6">
          <div className="max-w-4xl mx-auto px-4 flex items-center gap-3">
            <ShoppingCart size={24} />
            <h1 className="text-2xl md:text-3xl font-bold">
              {step === "cart" && "Carrito de Compras"}
              {step === "checkout" && "Finalizar Compra"}
              {step === "success" && "¡Compra Exitosa!"}
            </h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Step indicator */}
          {step !== "success" && (
            <div className="flex items-center gap-2 mb-6">
              <div className={`flex-1 h-2 rounded-full ${step === "cart" || step === "checkout" ? "bg-blue-600" : "bg-gray-200"}`} />
              <div className={`flex-1 h-2 rounded-full ${step === "checkout" ? "bg-blue-600" : "bg-gray-200"}`} />
            </div>
          )}

          {step === "cart" && (
            <>
              {items.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                  <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
                  <h2 className="text-xl font-bold mb-2">Tu carrito está vacío</h2>
                  <p className="text-gray-500 mb-6">Explora los emprendedores y agrega productos a tu carrito.</p>
                  <Link
                    to="/emprendedores"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    <ArrowLeft size={16} /> Ver Emprendedores
                  </Link>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {Object.entries(groupedByEntrepreneur).map(([entId, group]) => (
                      <div key={entId} className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="p-4 bg-blue-50 border-b flex items-center gap-2">
                          <Store size={16} className="text-blue-600" />
                          <Link
                            to={`/emprendedor/${group.slug}`}
                            className="font-medium text-blue-700 hover:underline"
                          >
                            {group.name}
                          </Link>
                        </div>
                        <div className="divide-y">
                          {group.items.map((item) => (
                            <div key={item.productId} className="p-4 flex gap-4 items-center">
                              <div className="w-20 h-20 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                                {item.image ? (
                                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-sm truncate">{item.name}</h3>
                                <p className="text-blue-600 font-medium text-sm">{item.price}</p>
                                <p className="text-xs text-gray-500">Vendido por {item.entrepreneurName}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                  className="w-8 h-8 rounded-lg border hover:bg-gray-50 flex items-center justify-center"
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="w-8 text-center font-medium">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                  className="w-8 h-8 rounded-lg border hover:bg-gray-50 flex items-center justify-center"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                              <button
                                onClick={() => removeItem(item.productId)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-600">Productos ({totalItems})</span>
                      <span className="text-xl font-bold">${totalPrice.toLocaleString("es-CL")}</span>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => navigate("/emprendedores")}
                      >
                        <ArrowLeft size={16} className="mr-2" /> Seguir comprando
                      </Button>
                      <Button
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                        onClick={() => setStep("checkout")}
                      >
                        <CreditCard size={16} className="mr-2" /> Finalizar compra
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {step === "checkout" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Order form */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-lg font-bold mb-4">📇 Datos del comprador</h2>
                  <form onSubmit={handleSubmitOrder} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Nombre completo *</label>
                        <input
                          type="text"
                          required
                          value={form.buyerName}
                          onChange={(e) => setForm({ ...form, buyerName: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Juan Pérez"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Email *</label>
                        <input
                          type="email"
                          required
                          value={form.buyerEmail}
                          onChange={(e) => setForm({ ...form, buyerEmail: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="tu@email.com"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Teléfono</label>
                        <input
                          type="tel"
                          value={form.buyerPhone}
                          onChange={(e) => setForm({ ...form, buyerPhone: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="+56 9 1234 5678"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Dirección de entrega</label>
                        <input
                          type="text"
                          value={form.buyerAddress}
                          onChange={(e) => setForm({ ...form, buyerAddress: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Calle 123, Comuna"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Método de pago *</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {Object.entries(paymentLabels).map(([key, label]) => (
                          <label
                            key={key}
                            className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition ${
                              form.paymentMethod === key
                                ? "border-blue-500 bg-blue-50"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            <input
                              type="radio"
                              name="paymentMethod"
                              value={key}
                              checked={form.paymentMethod === key}
                              onChange={(e) => setForm({ ...form, paymentMethod: e.target.value as any })}
                              className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-lg">{paymentIcons[key]}</span>
                            <span className="text-sm font-medium">{label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Notas adicionales</label>
                      <textarea
                        rows={3}
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Instrucciones especiales para la entrega..."
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => setStep("cart")}
                      >
                        <ArrowLeft size={16} className="mr-2" /> Volver al carrito
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        disabled={createOrder.isPending}
                      >
                        <CreditCard size={16} className="mr-2" />
                        {createOrder.isPending ? "Procesando..." : `Pagar $${totalPrice.toLocaleString("es-CL")}`}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Order summary */}
              <div>
                <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
                  <h2 className="text-lg font-bold mb-4">Resumen del pedido</h2>
                  <div className="space-y-3 mb-4">
                    {items.map((item) => (
                      <div key={item.productId} className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.name} x{item.quantity}</span>
                        <span className="font-medium">
                          ${(parseFloat(item.price.replace(/[^0-9.]/g, "")) * item.quantity).toLocaleString("es-CL")}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total</span>
                      <span className="text-2xl font-bold">${totalPrice.toLocaleString("es-CL")}</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg text-xs text-yellow-800">
                    <p>⚡ Al confirmar, recibirás instrucciones de pago por email. El emprendedor se contactará contigo para coordinar la entrega.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm">
              <CheckCircle size={80} className="mx-auto text-green-500 mb-4" />
              <h2 className="text-2xl font-bold mb-2">¡Pedido realizado con éxito!</h2>
              <p className="text-gray-600 mb-2">
                Gracias por comprar en Market Maule. Apoyaste a emprendedores locales de la región del Maule.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Recibirás un email con los detalles del pedido y las instrucciones de pago.
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => navigate("/emprendedores")}
                >
                  Seguir comprando
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    setStep("cart");
                    navigate("/");
                  }}
                >
                  Volver al inicio
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
