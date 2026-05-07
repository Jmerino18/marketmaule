import { Link } from "react-router";
import { Users, ArrowRight } from "lucide-react";

export default function JoinSection() {
  return (
    <section className="relative py-16 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/entrepreneur-join.jpg)" }}
      />
      <div className="absolute inset-0 bg-blue-900/70" />

      <div className="relative max-w-4xl mx-auto px-4 text-center text-white">
        <Users size={48} className="mx-auto mb-4 opacity-90" />
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          ¿Quieres unirte a la familia más grande de emprendedores de la región?
        </h2>
        <p className="text-lg mb-8 opacity-90">
          Sé parte de Market Maule y llega a miles de personas que buscan productos locales.
        </p>
        <Link
          to="/unirse"
          className="inline-flex items-center gap-2 px-8 py-4 bg-yellow-400 text-blue-900 rounded-full font-bold text-lg hover:bg-yellow-300 transition"
        >
          Ingresa Aquí <ArrowRight size={20} />
        </Link>
      </div>
    </section>
  );
}
