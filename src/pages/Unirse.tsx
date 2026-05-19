import { useState } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowLeft, Send } from "lucide-react";

export default function Unirse() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    communeId: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const { data: communes } = trpc.commune.list.useQuery();
  const createContact = trpc.contact.create.useMutation({
    onSuccess: () => setSubmitted(true),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createContact.mutate({
      name: form.name,
      email: form.email,
      phone: form.phone || undefined,
      communeId: form.communeId ? Number(form.communeId) : undefined,
      message: form.message || undefined,
      type: "join",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="bg-blue-700 text-white py-8">
          <div className="max-w-3xl mx-auto px-4">
            <Link to="/" className="inline-flex items-center gap-1 text-sm text-blue-200 hover:text-white mb-2">
              <ArrowLeft size={16} /> Volver al inicio
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold">Únete a Market Maule</h1>
            <p className="text-blue-100 mt-2">Sé parte de la vitrina de emprendedores más grande de la región</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-8">
          {submitted ? (
            <div className="bg-white rounded-xl p-8 text-center shadow-sm">
              <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
              <h2 className="text-2xl font-bold mb-2">¡Solicitud enviada!</h2>
              <p className="text-gray-600 mb-6">
                Gracias por tu interés. Nuestro equipo revisará tu solicitud y se pondrá en contacto contigo pronto.
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Volver al inicio
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-bold mb-4">Formulario de inscripción</h2>
              <p className="text-gray-600 mb-6">
                Completa tus datos y nos comunicaremos contigo para darte de alta en la plataforma.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre completo *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="tu@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Teléfono</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+56 9 1234 5678"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Comuna</label>
                  <select
                    value={form.communeId}
                    onChange={(e) => setForm({ ...form, communeId: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecciona tu comuna</option>
                    {communes?.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Mensaje</label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Cuéntanos sobre tu emprendimiento..."
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={createContact.isPending}
                >
                  <Send size={16} className="mr-2" />
                  {createContact.isPending ? "Enviando..." : "Enviar solicitud"}
                </Button>
              </form>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
