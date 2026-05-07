import { useState } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Search, Calendar, Eye } from "lucide-react";

export default function Noticias() {
  const [search, setSearch] = useState("");
  const { data: articles } = trpc.news.list.useQuery({
    status: "published",
    search: search || undefined,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="bg-blue-700 text-white py-8">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Noticias</h1>
            <p className="text-blue-100">Entérate de las últimas novedades de Market Maule</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Buscar noticias..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles?.map((n) => (
              <Link
                key={n.id}
                to={`/noticia/${n.slug}`}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden group"
              >
                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                  {n.image ? (
                    <img
                      src={n.image}
                      alt={n.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">📰</div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {n.publishedAt
                        ? new Date(n.publishedAt).toLocaleDateString("es-CL")
                        : new Date(n.createdAt).toLocaleDateString("es-CL")}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye size={12} /> {n.views} vistas
                    </span>
                  </div>
                  <h3 className="font-bold text-base mb-2 group-hover:text-blue-600 transition line-clamp-2">
                    {n.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{n.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>

          {(!articles || articles.length === 0) && (
            <div className="text-center py-16">
              <p className="text-gray-500">No hay noticias disponibles.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
