import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  Users,
  Package,
  Newspaper,
  Image,
  MessageSquare,
  TrendingUp,
  MapPin,
  Eye,
  Star,
  Plus,
  X,
} from "lucide-react";

export default function Admin() {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth({
    redirectOnUnauthenticated: true,
  });
  const [tab, setTab] = useState<"stats" | "entrepreneurs" | "products" | "news" | "banners" | "contacts">("stats");

  const isAdmin = user?.role === "admin";
  const isEditor = user?.role === "editor" || isAdmin;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isEditor) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Acceso denegado</h1>
            <p className="text-gray-500 mb-4">No tienes permisos para acceder al panel de administración.</p>
            <Button onClick={() => navigate("/")}>Volver al inicio</Button>
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
        <div className="bg-blue-700 text-white py-6">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-2xl md:text-3xl font-bold">Panel de Administración</h1>
            <p className="text-blue-100">Bienvenido, {user?.name}</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-wrap gap-2 mb-6">
            <TabButton active={tab === "stats"} onClick={() => setTab("stats")} icon={<BarChart3 size={16} />} label="Estadísticas" />
            <TabButton active={tab === "entrepreneurs"} onClick={() => setTab("entrepreneurs")} icon={<Users size={16} />} label="Emprendedores" />
            <TabButton active={tab === "products"} onClick={() => setTab("products")} icon={<Package size={16} />} label="Productos" />
            <TabButton active={tab === "news"} onClick={() => setTab("news")} icon={<Newspaper size={16} />} label="Noticias" />
            <TabButton active={tab === "banners"} onClick={() => setTab("banners")} icon={<Image size={16} />} label="Banners" />
            {isAdmin && (
              <TabButton active={tab === "contacts"} onClick={() => setTab("contacts")} icon={<MessageSquare size={16} />} label="Solicitudes" />
            )}
          </div>

          {tab === "stats" && <StatsTab />}
          {tab === "entrepreneurs" && <EntrepreneursTab isAdmin={isAdmin} />}
          {tab === "products" && <ProductsTab isAdmin={isAdmin} />}
          {tab === "news" && <NewsTab />}
          {tab === "banners" && <BannersTab />}
          {tab === "contacts" && isAdmin && <ContactsTab />}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
        active
          ? "bg-blue-600 text-white"
          : "bg-white text-gray-700 hover:bg-gray-100 border"
      }`}
    >
      {icon} {label}
    </button>
  );
}

// ================== STATS TAB ==================
function StatsTab() {
  const { data: dashboard } = trpc.stat.dashboard.useQuery({ days: 30 });
  const { data: entrepreneurs } = trpc.entrepreneur.list.useQuery({ status: "active" });
  const { data: products } = trpc.product.list.useQuery({ status: "active" });
  const { data: newsList } = trpc.news.list.useQuery({ status: "published" });

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard title="Emprendedores" value={entrepreneurs?.length || 0} icon={<Users size={20} />} color="blue" />
        <KpiCard title="Productos" value={products?.length || 0} icon={<Package size={20} />} color="green" />
        <KpiCard title="Noticias" value={newsList?.length || 0} icon={<Newspaper size={20} />} color="purple" />
        <KpiCard title="Vistas totales" value={entrepreneurs?.reduce((acc, e) => acc + (e.views || 0), 0) || 0} icon={<Eye size={20} />} color="orange" />
      </div>

      {/* Top Entrepreneurs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp size={18} /> Top Emprendedores Más Vistos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">#</th>
                  <th className="text-left py-2 px-3">Nombre</th>
                  <th className="text-left py-2 px-3">Vistas</th>
                </tr>
              </thead>
              <tbody>
                {dashboard?.topEntrepreneurs.map((e, i) => (
                  <tr key={e.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-3">{i + 1}</td>
                    <td className="py-2 px-3 font-medium">{e.name}</td>
                    <td className="py-2 px-3">{e.views}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Package size={18} /> Productos Más Vistos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">#</th>
                  <th className="text-left py-2 px-3">Producto</th>
                  <th className="text-left py-2 px-3">Emprendedor</th>
                  <th className="text-left py-2 px-3">Vistas</th>
                </tr>
              </thead>
              <tbody>
                {dashboard?.topProducts.map((p, i) => (
                  <tr key={p.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-3">{i + 1}</td>
                    <td className="py-2 px-3 font-medium">{p.name}</td>
                    <td className="py-2 px-3">{p.entrepreneurName}</td>
                    <td className="py-2 px-3">{p.views}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* By Commune */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin size={18} /> Emprendedores por Comuna
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">Comuna</th>
                  <th className="text-left py-2 px-3">Cantidad</th>
                  <th className="text-left py-2 px-3">% del total</th>
                </tr>
              </thead>
              <tbody>
                {dashboard?.byCommune.map((c) => (
                  <tr key={c.commune} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-3">{c.commune}</td>
                    <td className="py-2 px-3">{c.count}</td>
                    <td className="py-2 px-3">{((c.count / (entrepreneurs?.length || 1)) * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function KpiCard({ title, value, icon, color }: { title: string; value: number; icon: React.ReactNode; color: string }) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
          <div className={`p-3 rounded-lg ${colors[color]}`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

// ================== ENTREPRENEURS TAB ==================
function EntrepreneursTab({ isAdmin }: { isAdmin: boolean }) {
  const { data: list, refetch } = trpc.entrepreneur.list.useQuery({});
  const { data: communes } = trpc.commune.list.useQuery();
  const update = trpc.entrepreneur.update.useMutation({ onSuccess: () => refetch() });
  const deleteE = trpc.entrepreneur.delete.useMutation({ onSuccess: () => refetch() });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", communeId: "", categoryId: "", description: "" });
  const create = trpc.entrepreneur.create.useMutation({ onSuccess: () => { refetch(); setShowForm(false); setForm({ name: "", slug: "", communeId: "", categoryId: "", description: "" }); } });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Emprendedores</h2>
        <Button onClick={() => setShowForm(!showForm)} className="bg-blue-600">
          <Plus size={16} className="mr-1" /> Nuevo
        </Button>
      </div>

      {showForm && (
        <form onSubmit={(e) => { e.preventDefault(); create.mutate({ ...form, categoryId: form.categoryId ? Number(form.categoryId) : undefined, communeId: form.communeId ? Number(form.communeId) : undefined }); }} className="bg-white p-4 rounded-lg shadow-sm space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input placeholder="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="px-3 py-2 border rounded" required />
            <input placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="px-3 py-2 border rounded" required />
            <select value={form.communeId} onChange={(e) => setForm({ ...form, communeId: e.target.value })} className="px-3 py-2 border rounded">
              <option value="">Comuna</option>
              {communes?.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="px-3 py-2 border rounded">
              <option value="">Categoría</option>
              <option value="1">Alimentos</option>
              <option value="2">Artesanía</option>
              <option value="3">Belleza</option>
              <option value="4">Turismo</option>
              <option value="5">Tecnología</option>
              <option value="6">Moda</option>
              <option value="7">Madera</option>
              <option value="8">Vinos</option>
            </select>
          </div>
          <textarea placeholder="Descripción" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border rounded" rows={3} />
          <div className="flex gap-2">
            <Button type="submit" className="bg-blue-600" disabled={create.isPending}>Guardar</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4">Nombre</th>
                <th className="text-left py-3 px-4">Comuna</th>
                <th className="text-left py-3 px-4">Estado</th>
                <th className="text-left py-3 px-4">Vistas</th>
                <th className="text-left py-3 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {list?.map((e) => (
                <tr key={e.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{e.name}</td>
                  <td className="py-3 px-4">{e.commune?.name}</td>
                  <td className="py-3 px-4">
                    <select
                      value={e.status}
                      onChange={(ev) => update.mutate({ id: e.id, data: { status: ev.target.value as "pending" | "active" | "inactive" } })}
                      className="text-xs px-2 py-1 border rounded"
                    >
                      <option value="pending">Pendiente</option>
                      <option value="active">Activo</option>
                      <option value="inactive">Inactivo</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">{e.views}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => update.mutate({ id: e.id, data: { featured: !e.featured } })}
                        className={`p-1 rounded ${e.featured ? "text-yellow-500" : "text-gray-400"}`}
                        title="Destacar"
                      >
                        <Star size={16} fill={e.featured ? "currentColor" : "none"} />
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => { if (confirm("¿Eliminar este emprendedor?")) deleteE.mutate({ id: e.id }); }}
                          className="p-1 rounded text-red-500 hover:bg-red-50"
                          title="Eliminar"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ================== PRODUCTS TAB ==================
function ProductsTab({ isAdmin }: { isAdmin: boolean }) {
  const { data: list, refetch } = trpc.product.list.useQuery({});
  const update = trpc.product.update.useMutation({ onSuccess: () => refetch() });
  const deleteP = trpc.product.delete.useMutation({ onSuccess: () => refetch() });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", entrepreneurId: "", price: "", description: "" });
  const create = trpc.product.create.useMutation({ onSuccess: () => { refetch(); setShowForm(false); setForm({ name: "", entrepreneurId: "", price: "", description: "" }); } });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Productos</h2>
        <Button onClick={() => setShowForm(!showForm)} className="bg-blue-600">
          <Plus size={16} className="mr-1" /> Nuevo
        </Button>
      </div>

      {showForm && (
        <form onSubmit={(e) => { e.preventDefault(); create.mutate({ ...form, entrepreneurId: Number(form.entrepreneurId) }); }} className="bg-white p-4 rounded-lg shadow-sm space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input placeholder="Nombre del producto" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="px-3 py-2 border rounded" required />
            <input placeholder="ID Emprendedor" type="number" value={form.entrepreneurId} onChange={(e) => setForm({ ...form, entrepreneurId: e.target.value })} className="px-3 py-2 border rounded" required />
            <input placeholder="Precio" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="px-3 py-2 border rounded" />
          </div>
          <textarea placeholder="Descripción" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border rounded" rows={2} />
          <div className="flex gap-2">
            <Button type="submit" className="bg-blue-600" disabled={create.isPending}>Guardar</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4">Nombre</th>
                <th className="text-left py-3 px-4">Emprendedor</th>
                <th className="text-left py-3 px-4">Precio</th>
                <th className="text-left py-3 px-4">Estado</th>
                <th className="text-left py-3 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {list?.map((p) => (
                <tr key={p.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{p.name}</td>
                  <td className="py-3 px-4">{p.entrepreneur?.name}</td>
                  <td className="py-3 px-4">{p.price || "-"}</td>
                  <td className="py-3 px-4">
                    <select
                      value={p.status}
                      onChange={(ev) => update.mutate({ id: p.id, data: { status: ev.target.value as "active" | "inactive" } })}
                      className="text-xs px-2 py-1 border rounded"
                    >
                      <option value="active">Activo</option>
                      <option value="inactive">Inactivo</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => update.mutate({ id: p.id, data: { featured: !p.featured } })}
                        className={`p-1 rounded ${p.featured ? "text-yellow-500" : "text-gray-400"}`}
                        title="Destacar"
                      >
                        <Star size={16} fill={p.featured ? "currentColor" : "none"} />
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => { if (confirm("¿Eliminar este producto?")) deleteP.mutate({ id: p.id }); }}
                          className="p-1 rounded text-red-500 hover:bg-red-50"
                          title="Eliminar"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ================== NEWS TAB ==================
function NewsTab() {
  const { data: list, refetch } = trpc.news.list.useQuery({});
  const update = trpc.news.update.useMutation({ onSuccess: () => refetch() });
  const deleteN = trpc.news.delete.useMutation({ onSuccess: () => refetch() });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", slug: "", excerpt: "", content: "" });
  const create = trpc.news.create.useMutation({ onSuccess: () => { refetch(); setShowForm(false); setForm({ title: "", slug: "", excerpt: "", content: "" }); } });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Noticias</h2>
        <Button onClick={() => setShowForm(!showForm)} className="bg-blue-600">
          <Plus size={16} className="mr-1" /> Nueva
        </Button>
      </div>

      {showForm && (
        <form onSubmit={(e) => { e.preventDefault(); create.mutate(form); }} className="bg-white p-4 rounded-lg shadow-sm space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input placeholder="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="px-3 py-2 border rounded" required />
            <input placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="px-3 py-2 border rounded" required />
          </div>
          <input placeholder="Extracto" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="w-full px-3 py-2 border rounded" />
          <textarea placeholder="Contenido" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="w-full px-3 py-2 border rounded" rows={4} />
          <div className="flex gap-2">
            <Button type="submit" className="bg-blue-600" disabled={create.isPending}>Publicar</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4">Título</th>
                <th className="text-left py-3 px-4">Estado</th>
                <th className="text-left py-3 px-4">Vistas</th>
                <th className="text-left py-3 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {list?.map((n) => (
                <tr key={n.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{n.title}</td>
                  <td className="py-3 px-4">
                    <select
                      value={n.status}
                      onChange={(ev) => update.mutate({ id: n.id, data: { status: ev.target.value as "draft" | "published" | "archived" } })}
                      className="text-xs px-2 py-1 border rounded"
                    >
                      <option value="draft">Borrador</option>
                      <option value="published">Publicado</option>
                      <option value="archived">Archivado</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">{n.views}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => { if (confirm("¿Eliminar esta noticia?")) deleteN.mutate({ id: n.id }); }}
                      className="p-1 rounded text-red-500 hover:bg-red-50"
                    >
                      <X size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ================== BANNERS TAB ==================
function BannersTab() {
  const { data: list, refetch } = trpc.banner.list.useQuery({});
  const update = trpc.banner.update.useMutation({ onSuccess: () => refetch() });
  const deleteB = trpc.banner.delete.useMutation({ onSuccess: () => refetch() });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", image: "", link: "", position: "home_hero" as "home_hero" | "home_mid" | "sidebar", subtitle: "" });
  const create = trpc.banner.create.useMutation({ onSuccess: () => { refetch(); setShowForm(false); setForm({ title: "", image: "", link: "", position: "home_hero", subtitle: "" }); } });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Banners</h2>
        <Button onClick={() => setShowForm(!showForm)} className="bg-blue-600">
          <Plus size={16} className="mr-1" /> Nuevo
        </Button>
      </div>

      {showForm && (
        <form onSubmit={(e) => { e.preventDefault(); create.mutate(form); }} className="bg-white p-4 rounded-lg shadow-sm space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input placeholder="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="px-3 py-2 border rounded" required />
            <input placeholder="URL de imagen" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="px-3 py-2 border rounded" required />
            <input placeholder="Link" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} className="px-3 py-2 border rounded" />
            <select value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value as "home_hero" | "home_mid" | "sidebar" })} className="px-3 py-2 border rounded">
              <option value="home_hero">Hero Inicio</option>
              <option value="home_mid">Medio Inicio</option>
              <option value="sidebar">Sidebar</option>
            </select>
          </div>
          <input placeholder="Subtítulo" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className="w-full px-3 py-2 border rounded" />
          <div className="flex gap-2">
            <Button type="submit" className="bg-blue-600" disabled={create.isPending}>Guardar</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {list?.map((b) => (
          <div key={b.id} className={`bg-white rounded-lg shadow-sm overflow-hidden border ${!b.active ? "opacity-60" : ""}`}>
            <div className="h-40 bg-gray-100 relative">
              {b.image && <img src={b.image} alt={b.title} className="w-full h-full object-cover" />}
            </div>
            <div className="p-4">
              <h3 className="font-bold">{b.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{b.position} • Orden: {b.order}</p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => update.mutate({ id: b.id, data: { active: !b.active } })}
                  className={`text-xs px-2 py-1 rounded ${b.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}
                >
                  {b.active ? "Activo" : "Inactivo"}
                </button>
                <button
                  onClick={() => { if (confirm("¿Eliminar este banner?")) deleteB.mutate({ id: b.id }); }}
                  className="text-xs px-2 py-1 rounded bg-red-100 text-red-600"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ================== CONTACTS TAB ==================
function ContactsTab() {
  const { data: list, refetch } = trpc.contact.list.useQuery({});
  const updateStatus = trpc.contact.updateStatus.useMutation({ onSuccess: () => refetch() });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Solicitudes de Contacto</h2>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4">Nombre</th>
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-left py-3 px-4">Tipo</th>
                <th className="text-left py-3 px-4">Estado</th>
                <th className="text-left py-3 px-4">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {list?.map((c) => (
                <tr key={c.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{c.name}</td>
                  <td className="py-3 px-4">{c.email}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded ${
                      c.type === "join" ? "bg-blue-100 text-blue-700" :
                      c.type === "support" ? "bg-orange-100 text-orange-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {c.type}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={c.status}
                      onChange={(ev) => updateStatus.mutate({ id: c.id, status: ev.target.value as "new" | "read" | "replied" | "closed" })}
                      className="text-xs px-2 py-1 border rounded"
                    >
                      <option value="new">Nuevo</option>
                      <option value="read">Leído</option>
                      <option value="replied">Respondido</option>
                      <option value="closed">Cerrado</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-gray-500">
                    {new Date(c.createdAt).toLocaleDateString("es-CL")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
