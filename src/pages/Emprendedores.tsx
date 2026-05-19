import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router";
import { trpc } from "@/providers/trpc";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Search, MapPin, Tag, Store, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Emprendedores() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [communeId, setCommuneId] = useState(searchParams.get("commune") || "");
  const [showFilters, setShowFilters] = useState(false);

  const { data: allEntrepreneurs } = trpc.entrepreneur.list.useQuery({
    status: "active",
  });

  const { data: filtered } = trpc.entrepreneur.list.useQuery({
    status: "active",
    search: search || undefined,
    categoryId: category ? Number(category) : undefined,
    communeId: communeId ? Number(communeId) : undefined,
  });

  const { data: communes } = trpc.commune.list.useQuery();
  const entrepreneurs = filtered || allEntrepreneurs || [];

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (communeId) params.set("commune", communeId);
    setSearchParams(params, { replace: true });
  }, [search, category, communeId, setSearchParams]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="bg-blue-700 text-white py-8">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Emprendedores</h1>
            <p className="text-blue-100">Descubre todos los emprendimientos de la región del Maule</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Buscar emprendedores..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden"
              >
                <Filter size={16} className="mr-2" /> Filtros
              </Button>
              <div className={`flex gap-3 ${showFilters ? "flex" : "hidden md:flex"}`}>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todas las categorías</option>
                  <option value="1">Alimentos</option>
                  <option value="2">Artesanía</option>
                  <option value="3">Belleza</option>
                  <option value="4">Turismo</option>
                  <option value="5">Tecnología</option>
                  <option value="6">Moda</option>
                  <option value="7">Madera</option>
                  <option value="8">Vinos</option>
                </select>
                <select
                  value={communeId}
                  onChange={(e) => setCommuneId(e.target.value)}
                  className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todas las comunas</option>
                  {communes?.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {(search || category || communeId) && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSearch("");
                      setCategory("");
                      setCommuneId("");
                    }}
                  >
                    <X size={16} />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Results */}
          <p className="text-sm text-gray-500 mb-4">
            {entrepreneurs.length} emprendimiento{entrepreneurs.length !== 1 ? "s" : ""} encontrado
            {entrepreneurs.length !== 1 ? "s" : ""}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {entrepreneurs.map((e) => (
              <Link
                key={e.id}
                to={`/emprendedor/${e.slug}`}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden group"
              >
                <div className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
                  {e.logo ? (
                    <img
                      src={e.logo}
                      alt={e.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">
                      {e.category?.icon || "🏪"}
                    </div>
                  )}
                  {e.featured && (
                    <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full font-medium">
                      ⭐ Destacado
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1 group-hover:text-blue-600 transition">
                    {e.name}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {e.commune?.name || "Maule"}
                    </span>
                    {e.category?.name && (
                      <span className="flex items-center gap-1">
                        <Tag size={12} /> {e.category.name}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {e.shortDescription || e.description}
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-xs text-blue-600">
                    <Store size={14} /> Ver emprendimiento
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {entrepreneurs.length === 0 && (
            <div className="text-center py-16">
              <Store size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No se encontraron emprendedores con estos filtros.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
