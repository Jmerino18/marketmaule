import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { Calendar, ArrowRight, Eye } from "lucide-react";

export default function NewsSection() {
  const { data: articles } = trpc.news.list.useQuery({
    status: "published",
    limit: 6,
  });

  if (!articles?.length) return null;

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Noticias</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((n) => (
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

        <div className="text-center mt-8">
          <Link
            to="/noticias"
            className="inline-flex items-center gap-2 text-blue-600 font-medium hover:underline"
          >
            Ver todas las noticias <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
