import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { Star, MapPin } from "lucide-react";

export default function FeaturedEntrepreneurs() {
  const { data: featured } = trpc.entrepreneur.list.useQuery({
    status: "active",
    featured: true,
  });

  if (!featured?.length) return null;

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          Emprendimientos Destacados
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.slice(0, 4).map((e) => (
            <Link
              key={e.id}
              to={`/emprendedor/${e.slug}`}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden group"
            >
              <div className="h-40 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center relative overflow-hidden">
                {e.logo ? (
                  <img
                    src={e.logo}
                    alt={e.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="text-5xl">{e.category?.icon || "🏪"}</div>
                )}
                <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Star size={10} fill="currentColor" /> Destacado
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1 group-hover:text-blue-600 transition">
                  {e.name}
                </h3>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <MapPin size={14} /> {e.commune?.name || "Maule"}
                </p>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {e.shortDescription || e.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
