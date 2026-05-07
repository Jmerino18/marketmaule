import { useParams, Link } from "react-router";
import { trpc } from "@/providers/trpc";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, Calendar, Eye, User } from "lucide-react";

export default function NoticiaDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: article } = trpc.news.bySlug.useQuery(
    { slug: slug || "" },
    { enabled: !!slug }
  );

  if (!article) {
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <Link to="/noticias" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600">
              <ArrowLeft size={16} /> Volver a noticias
            </Link>
          </div>
        </div>

        <article className="max-w-4xl mx-auto px-4 py-8">
          {article.image && (
            <div className="rounded-xl overflow-hidden mb-6">
              <img src={article.image} alt={article.title} className="w-full h-64 md:h-96 object-cover" />
            </div>
          )}

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {article.publishedAt
                ? new Date(article.publishedAt).toLocaleDateString("es-CL", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : new Date(article.createdAt).toLocaleDateString("es-CL", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
            </span>
            <span className="flex items-center gap-1">
              <Eye size={14} /> {article.views} vistas
            </span>
            {article.author?.name && (
              <span className="flex items-center gap-1">
                <User size={14} /> {article.author.name}
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>

          {article.excerpt && (
            <p className="text-xl text-gray-600 mb-6 font-medium">{article.excerpt}</p>
          )}

          <div className="prose prose-blue max-w-none">
            {article.content ? (
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {article.content}
              </div>
            ) : (
              <p className="text-gray-500 italic">Contenido no disponible.</p>
            )}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
