import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { Search, X, MapPin, Tag, Store } from "lucide-react";

export default function SearchSection() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("");
  const [communeId, setCommuneId] = useState<string>("");
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const { data: communes } = trpc.commune.list.useQuery();

  // Real-time search
  const { data: searchResults } = trpc.entrepreneur.list.useQuery(
    {
      status: "active",
      search: query.length >= 2 ? query : undefined,
      categoryId: category ? Number(category) : undefined,
      communeId: communeId ? Number(communeId) : undefined,
    },
    { enabled: query.length >= 2 || !!category || !!communeId }
  );

  useEffect(() => {
    if (query.length >= 2 || category || communeId) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [query, category, communeId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("search", query);
    if (category) params.set("category", category);
    if (communeId) params.set("commune", communeId);
    navigate(`/emprendedores?${params.toString()}`);
    setShowResults(false);
  };

  return (
    <section className="bg-white py-8 border-b">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-center text-xl font-semibold mb-4">
          Busca tu emprendedor, comuna o categoría aquí
        </h2>

        <form onSubmit={handleSearch} className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Busca emprendedores, productos, comunas..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="flex gap-3 flex-wrap">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex-1 min-w-[150px] px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="flex-1 min-w-[150px] px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las comunas</option>
              {communes?.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Buscar
            </button>
          </div>
        </form>

        {/* Live results dropdown */}
        {showResults && searchResults && searchResults.length > 0 && (
          <div className="mt-3 bg-white border rounded-lg shadow-lg max-h-80 overflow-auto">
            {searchResults.slice(0, 8).map((e) => (
              <button
                key={e.id}
                onClick={() => {
                  navigate(`/emprendedor/${e.slug}`);
                  setShowResults(false);
                }}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 text-left border-b last:border-0"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  {e.logo ? (
                    <img src={e.logo} alt={e.name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <Store size={18} className="text-blue-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{e.name}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    {e.commune?.name && <><MapPin size={12} /> {e.commune.name}</>}
                    {e.category?.name && <><Tag size={12} /> {e.category.name}</>}
                  </p>
                </div>
              </button>
            ))}
            {searchResults.length > 8 && (
              <button
                onClick={handleSearch}
                className="w-full px-4 py-2 text-center text-blue-600 hover:bg-blue-50 font-medium"
              >
                Ver todos los {searchResults.length} resultados
              </button>
            )}
          </div>
        )}

        {showResults && query.length >= 2 && searchResults?.length === 0 && (
          <div className="mt-3 bg-white border rounded-lg shadow-lg p-4 text-center text-gray-500">
            No se encontraron emprendedores para "{query}"
          </div>
        )}
      </div>
    </section>
  );
}
