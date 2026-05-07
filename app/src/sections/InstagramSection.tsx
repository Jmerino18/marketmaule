import { Instagram } from "lucide-react";

export default function InstagramSection() {
  // Simulated Instagram feed - 12 items max
  const images = [
    "/images/product-mermeladas.jpg",
    "/images/product-artesanias.jpg",
    "/images/product-miel.jpg",
    "/images/banner-hero-1.jpg",
    "/images/news-market.jpg",
    "/images/entrepreneur-join.jpg",
    "/images/product-mermeladas.jpg",
    "/images/product-artesanias.jpg",
    "/images/product-miel.jpg",
    "/images/banner-hero-1.jpg",
    "/images/news-market.jpg",
    "/images/entrepreneur-join.jpg",
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">Instagram</h2>
        <p className="text-center text-gray-500 mb-8">@marketmaule</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {images.map((img, i) => (
            <a
              key={i}
              href="https://www.instagram.com/marketmaule/"
              target="_blank"
              rel="noopener"
              className="aspect-square rounded-lg overflow-hidden relative group"
            >
              <img
                src={img}
                alt={`Instagram ${i + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center">
                <Instagram className="text-white opacity-0 group-hover:opacity-100 transition" size={28} />
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-6">
          <a
            href="https://www.instagram.com/marketmaule/"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 px-6 py-2 border border-pink-500 text-pink-600 rounded-full hover:bg-pink-50 transition"
          >
            <Instagram size={18} /> Síguenos en Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
