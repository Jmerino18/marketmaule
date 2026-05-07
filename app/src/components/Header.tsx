import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import {
  Search,
  Menu,
  X,
  User,
  LogOut,
  BarChart3,
  ShoppingCart,
} from "lucide-react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();

  const isAdmin = user?.role === "admin";
  const isEditor = user?.role === "editor" || isAdmin;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/emprendedores?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      {/* Top bar */}
      <div className="bg-blue-700 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="font-medium">
            LA VITRINA DE EMPRENDEDORES MÁS GRANDE DE LA REGIÓN
          </span>
          <div className="flex gap-3">
            <span>Síguenos en:</span>
            <a href="https://www.instagram.com/marketmaule/" target="_blank" rel="noopener" className="hover:text-blue-200">
              Instagram
            </a>
            <a href="https://facebook.com/marketmaule" target="_blank" rel="noopener" className="hover:text-blue-200">
              Facebook
            </a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <img src="/logo.png" alt="Market Maule" className="h-10 w-auto" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/" className="hover:text-blue-700 transition-colors">HOME</Link>
          <Link to="/quienes-somos" className="hover:text-blue-700 transition-colors">QUIENES SOMOS</Link>
          <Link to="/emprendedores" className="hover:text-blue-700 transition-colors">EMPRENDEDORES</Link>
          <Link to="/noticias" className="hover:text-blue-700 transition-colors">NOTICIAS</Link>
          <Link to="/contacto" className="hover:text-blue-700 transition-colors">CONTACTO</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchOpen(!searchOpen)}
            className="text-gray-600"
          >
            {searchOpen ? <X size={20} /> : <Search size={20} />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/checkout")}
            className="text-gray-600 relative"
          >
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Button>

          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-2">
              {isEditor && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/admin")}
                  className="text-gray-600"
                >
                  <BarChart3 size={16} className="mr-1" />
                  Admin
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-gray-600"
              >
                <LogOut size={16} className="mr-1" />
                Salir
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/login")}
              className="hidden md:flex border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              <User size={16} className="mr-1" />
              INICIAR SESIÓN
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-gray-600"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Search bar */}
      {searchOpen && (
        <div className="border-t bg-gray-50 px-4 py-3">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-2">
            <input
              type="text"
              placeholder="Buscar emprendedores, productos o comunas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              <Search size={18} />
            </Button>
          </form>
        </div>
      )}

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t bg-white px-4 py-4 space-y-3">
          <Link to="/" onClick={() => setMenuOpen(false)} className="block py-2 font-medium">Home</Link>
          <Link to="/quienes-somos" onClick={() => setMenuOpen(false)} className="block py-2 font-medium">Quienes Somos</Link>
          <Link to="/emprendedores" onClick={() => setMenuOpen(false)} className="block py-2 font-medium">Emprendedores</Link>
          <Link to="/noticias" onClick={() => setMenuOpen(false)} className="block py-2 font-medium">Noticias</Link>
          <Link to="/contacto" onClick={() => setMenuOpen(false)} className="block py-2 font-medium">Contacto</Link>
          <Link to="/checkout" onClick={() => setMenuOpen(false)} className="block py-2 font-medium flex items-center gap-2">
            🛒 Carrito {totalItems > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{totalItems}</span>}
          </Link>
          <hr />
          {isAuthenticated ? (
            <>
              {isEditor && (
                <Link to="/admin" onClick={() => setMenuOpen(false)} className="block py-2 font-medium flex items-center gap-2">
                  <BarChart3 size={16} /> Panel Admin
                </Link>
              )}
              <button onClick={logout} className="block py-2 font-medium text-red-600 flex items-center gap-2">
                <LogOut size={16} /> Cerrar Sesión
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)} className="block py-2 font-medium text-blue-600">
              Iniciar Sesión
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
