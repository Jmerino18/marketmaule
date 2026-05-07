import { useParams, Link, useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { useCart } from "@/hooks/useCart";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Instagram,
  Facebook,
  MessageCircle,
  ArrowLeft,
  ExternalLink,
  Eye,
  Tag,
  Package,
  ShoppingCart,
  CreditCard,
} from "lucide-react";

export default function EmprendedorDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { data: entrepreneur } = trpc.entrepreneur.bySlug.useQuery(
    { slug: slug || "" },
    { enabled: !!slug }
  );

  if (!entrepreneur) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-500">Cargando...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const products = entrepreneur.products || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Link to="/" className="hover:text-blue-600">Home</Link>
              <span>/</span>
              <Link to="/emprendedores" className="hover:text-blue-600">Emprendedores</Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">{entrepreneur.name}</span>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <Link
              to="/emprendedores"
              className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 mb-4"
            >
              <ArrowLeft size={16} /> Volver a emprendedores
            </Link>

            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden bg-blue-50 flex-shrink-0">
                {entrepreneur.logo ? (
                  <img src={entrepreneur.logo} alt={entrepreneur.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    {entrepreneur.category?.icon || "🏪"}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{entrepreneur.name}</h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin size={14} /> {entrepreneur.commune?.name}, {entrepreneur.region}
                  </span>
                  {entrepreneur.category?.name && (
                    <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      <Tag size={12} /> {entrepreneur.category.name}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Eye size={14} /> {entrepreneur.views} vistas
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Description & Products */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-bold mb-3">Descripción</h2>
                <p className="text-gray-700 leading-relaxed">
                  {entrepreneur.description || "Sin descripción disponible."}
                </p>
              </div>

              {/* Products */}
              {products.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Package size={20} /> Productos ({products.length})
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {products.map((p) => (
                      <div
                        key={p.id}
                        className="border rounded-lg overflow-hidden hover:shadow-md transition"
                      >
                        <div className="h-40 bg-gradient-to-br from-gray-50 to-gray-100">
                          {p.image ? (
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-3xl">📦</div>
                          )}
                        </div>
                        <div className="p-3">
                          <h3 className="font-bold text-sm">{p.name}</h3>
                          {p.price && (
                            <p className="text-blue-600 font-medium text-sm mt-1">{p.price}</p>
                          )}
                          {p.description && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{p.description}</p>
                          )}
                          <div className="flex gap-2 mt-3">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 text-xs"
                              onClick={() =>
                                addItem({
                                  productId: p.id,
                                  name: p.name,
                                  price: p.price || "$0",
                                  image: p.image || undefined,
                                  quantity: 1,
                                  entrepreneurId: entrepreneur.id,
                                  entrepreneurName: entrepreneur.name,
                                  entrepreneurSlug: entrepreneur.slug,
                                })
                              }
                            >
                              <ShoppingCart size={14} className="mr-1" /> Agregar
                            </Button>
                            <Button
                              size="sm"
                              className="flex-1 text-xs bg-blue-600 hover:bg-blue-700"
                              onClick={() => {
                                addItem({
                                  productId: p.id,
                                  name: p.name,
                                  price: p.price || "$0",
                                  image: p.image || undefined,
                                  quantity: 1,
                                  entrepreneurId: entrepreneur.id,
                                  entrepreneurName: entrepreneur.name,
                                  entrepreneurSlug: entrepreneur.slug,
                                });
                                navigate("/checkout");
                              }}
                            >
                              <CreditCard size={14} className="mr-1" /> Comprar
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Map */}
              {entrepreneur.mapUrl && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-lg font-bold mb-3">Ubicación</h2>
                  <div className="rounded-lg overflow-hidden aspect-video">
                    <iframe
                      src={entrepreneur.mapUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0, minHeight: 300 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`Mapa de ${entrepreneur.name}`}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Right: Contact */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-bold mb-4">Datos de contacto</h2>
                <div className="space-y-3">
                  {entrepreneur.website && (
                    <a
                      href={entrepreneur.website}
                      target="_blank"
                      rel="noopener"
                      className="flex items-center gap-3 text-sm text-blue-600 hover:underline"
                    >
                      <Globe size={16} /> {entrepreneur.website}
                      <ExternalLink size={12} />
                    </a>
                  )}
                  {entrepreneur.email && (
                    <a
                      href={`mailto:${entrepreneur.email}`}
                      className="flex items-center gap-3 text-sm text-gray-700 hover:text-blue-600"
                    >
                      <Mail size={16} /> {entrepreneur.email}
                    </a>
                  )}
                  {entrepreneur.phone && (
                    <a
                      href={`tel:${entrepreneur.phone}`}
                      className="flex items-center gap-3 text-sm text-gray-700 hover:text-blue-600"
                    >
                      <Phone size={16} /> {entrepreneur.phone}
                    </a>
                  )}
                  {entrepreneur.whatsapp && (
                    <a
                      href={`https://wa.me/${entrepreneur.whatsapp.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener"
                      className="flex items-center gap-3 text-sm text-green-600 hover:underline"
                    >
                      <MessageCircle size={16} /> WhatsApp
                    </a>
                  )}
                  {entrepreneur.instagram && (
                    <a
                      href={entrepreneur.instagram.startsWith("http") ? entrepreneur.instagram : `https://instagram.com/${entrepreneur.instagram.replace("@", "")}`}
                      target="_blank"
                      rel="noopener"
                      className="flex items-center gap-3 text-sm text-pink-600 hover:underline"
                    >
                      <Instagram size={16} /> {entrepreneur.instagram}
                    </a>
                  )}
                  {entrepreneur.facebook && (
                    <a
                      href={entrepreneur.facebook}
                      target="_blank"
                      rel="noopener"
                      className="flex items-center gap-3 text-sm text-blue-600 hover:underline"
                    >
                      <Facebook size={16} /> Facebook
                    </a>
                  )}
                  {entrepreneur.address && (
                    <div className="flex items-start gap-3 text-sm text-gray-700">
                      <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                      <span>{entrepreneur.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
