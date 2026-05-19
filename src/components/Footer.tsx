import { Link } from "react-router";
import { Instagram, Facebook, Youtube, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <img src="/logo.png" alt="Market Maule" className="h-12 w-auto brightness-0 invert" />
            <p className="text-blue-200 text-sm">
              La vitrina digital de emprendedores más grande de la Región del Maule. 
              Conectamos productos locales con la comunidad.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold mb-4">Navegación</h4>
            <ul className="space-y-2 text-sm text-blue-200">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li><Link to="/quienes-somos" className="hover:text-white">Quienes Somos</Link></li>
              <li><Link to="/emprendedores" className="hover:text-white">Emprendedores</Link></li>
              <li><Link to="/noticias" className="hover:text-white">Noticias</Link></li>
              <li><Link to="/contacto" className="hover:text-white">Contacto</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4">Contacto</h4>
            <ul className="space-y-2 text-sm text-blue-200">
              <li className="flex items-center gap-2"><MapPin size={14} /> Talca, Región del Maule</li>
              <li className="flex items-center gap-2"><Phone size={14} /> +56 9 1234 5678</li>
              <li className="flex items-center gap-2"><Mail size={14} /> hola@marketmaule.cl</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-bold mb-4">Nuestras Redes</h4>
            <div className="flex gap-3">
              <a href="https://www.instagram.com/marketmaule/" target="_blank" rel="noopener" className="bg-blue-800 p-2 rounded hover:bg-blue-700 transition">
                <Instagram size={18} />
              </a>
              <a href="https://facebook.com/marketmaule" target="_blank" rel="noopener" className="bg-blue-800 p-2 rounded hover:bg-blue-700 transition">
                <Facebook size={18} />
              </a>
              <a href="https://youtube.com/marketmaule" target="_blank" rel="noopener" className="bg-blue-800 p-2 rounded hover:bg-blue-700 transition">
                <Youtube size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-950 py-3 text-center text-xs text-blue-300">
        © Market Maule 2025. Todos los derechos reservados.
      </div>
    </footer>
  );
}
