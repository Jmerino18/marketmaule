import { useState, useEffect } from "react";
import { trpc } from "@/providers/trpc";
import { Link } from "react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HeroSection() {
  const { data: banners } = trpc.banner.list.useQuery({ position: "home_hero" });
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!banners?.length) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners]);

  if (!banners?.length) {
    return (
      <section className="relative h-[400px] md:h-[500px] bg-gradient-to-r from-blue-700 to-blue-500 flex items-center justify-center text-white">
        <div className="text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Compra en el Comercio Local</h1>
          <p className="text-xl md:text-2xl mb-6">Elige emprendimientos de maulinos para maulinos</p>
          <Link
            to="/emprendedores"
            className="inline-block bg-white text-blue-700 px-8 py-3 rounded-full font-bold hover:bg-blue-50 transition"
          >
            Ver Emprendedores
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[400px] md:h-[500px] overflow-hidden">
      {banners.map((b, i) => (
        <div
          key={b.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={b.image}
            alt={b.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-4 w-full">
              <div className="max-w-xl text-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-3">{b.title}</h1>
                {b.subtitle && <p className="text-xl md:text-2xl mb-6">{b.subtitle}</p>}
                {b.link && (
                  <Link
                    to={b.link}
                    className="inline-block bg-white text-blue-700 px-8 py-3 rounded-full font-bold hover:bg-blue-50 transition"
                  >
                    Ver Más
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {banners.length > 1 && (
        <>
          <button
            onClick={() => setCurrent((prev) => (prev - 1 + banners.length) % banners.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => setCurrent((prev) => (prev + 1) % banners.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur"
          >
            <ChevronRight size={24} />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-3 h-3 rounded-full transition ${
                  i === current ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
