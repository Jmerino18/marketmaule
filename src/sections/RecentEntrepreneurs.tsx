import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { MapPin, ArrowRight } from "lucide-react";

export default function RecentEntrepreneurs() {
  const { data: recent } = trpc.entrepreneur.list.useQuery({
    status: "active",
  });

  if (!recent?.length) return null;

  const latest = recent.slice(0, 8);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          Últimos Emprendimientos Ingresados
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {latest.map((e) => (
            <Link
              key={e.id}
              to={`/emprendedor/${e.slug}`}
              className="bg-white rounded-xl border hover:border-blue-300 transition overflow-hidden group"
            >
              <div className="h-36 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative">
                {e.logo ? (
                  <img
                    src={e.logo}
                    alt={e.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="text-4xl">{e.category?.icon || "🏪"}</div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-base mb-1 group-hover:text-blue-600 transition">
                  {e.name}
                </h3>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <MapPin size={12} /> {e.commune?.name || "Maule"}
                </p>
                {e.category?.name && (
                  <span className="inline-block mt-2 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                    {e.category.name}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            to="/emprendedores"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition"
          >
            Ver Más Emprendedores <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
