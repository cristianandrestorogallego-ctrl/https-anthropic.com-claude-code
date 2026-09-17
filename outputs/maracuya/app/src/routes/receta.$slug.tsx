import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Check,
  ChevronRight,
  Clock,
  Flame,
  Minus,
  Plus,
  ShoppingBag,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { useCarrito } from "@/components/site/cart";
import { banderaUrl, formatoPrecio, paisPorId, recetaPorSlug } from "@/lib/catalogo";
import { calcularPaquete, cantidad } from "@/lib/paquete";

export const Route = createFileRoute("/receta/$slug")({
  loader: ({ params }) => {
    const receta = recetaPorSlug(params.slug);
    if (!receta) throw notFound();
    return { receta };
  },
  head: ({ loaderData }) => {
    const r = loaderData?.receta;
    if (!r) return {};
    return {
      meta: [
        { title: `${r.nombre} | Cocina con MARACUYA` },
        { name: "description", content: r.resumen },
        { property: "og:title", content: r.nombre },
        { property: "og:type", content: "article" },
      ],
    };
  },
  component: DetalleReceta,
});

function DetalleReceta() {
  const { receta } = Route.useLoaderData();
  const { agregar } = useCarrito();
  const pais = paisPorId(receta.pais);

  const [raciones, setRaciones] = useState(receta.racionesBase);
  const [desmarcados, setDesmarcados] = useState<ReadonlySet<string>>(new Set());

  const paquete = useMemo(
    () => calcularPaquete(receta, raciones, desmarcados),
    [receta, raciones, desmarcados],
  );

  function alternar(productoId: string) {
    setDesmarcados((previo) => {
      const copia = new Set(previo);
      if (copia.has(productoId)) copia.delete(productoId);
      else copia.add(productoId);
      return copia;
    });
  }

  function anadirPaquete() {
    for (const linea of paquete.lineas) {
      if (!linea.elegido || !linea.disponible) continue;
      agregar(linea.producto, linea.envases);
    }
  }

  const comprables = paquete.lineas.filter((l) => l.elegido && l.disponible);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-10">
        <nav
          aria-label="Ruta de navegación"
          className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground"
        >
          <Link to="/" className="hover:text-primary">
            Inicio
          </Link>
          <ChevronRight className="size-3.5 shrink-0" aria-hidden="true" />
          <Link to="/recetas" className="hover:text-primary">
            Recetas
          </Link>
          <ChevronRight className="size-3.5 shrink-0" aria-hidden="true" />
          <span aria-current="page" className="text-foreground">
            {receta.nombre}
          </span>
        </nav>

        <div className="mt-6 overflow-hidden rounded-3xl shadow-[var(--shadow-e3)]">
          <img
            src={receta.imagen}
            alt={receta.nombre}
            className="aspect-16/7 w-full object-cover"
          />
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_22rem] lg:gap-14">
          {/* ── Receta ───────────────────────────────────────────────── */}
          <div>
            <h1 className="font-display text-3xl leading-tight tracking-[-0.025em] sm:text-4xl">
              {receta.nombre}
            </h1>

            <p className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <img
                  src={banderaUrl(pais.codigo)}
                  alt=""
                  width={20}
                  height={14}
                  className="h-3.5 w-5 rounded-[2px] object-cover"
                />
                Tradición de {pais.nombre}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-4" aria-hidden="true" />
                <span className="tabular">{receta.minutos} min</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Flame className="size-4" aria-hidden="true" />
                {receta.dificultad}
              </span>
              <span>{receta.tipo}</span>
            </p>

            <p className="mt-5 max-w-prose leading-relaxed text-muted-foreground">
              {receta.resumen}
            </p>

            <h2 className="mt-12 font-display text-2xl tracking-[-0.015em]">Cómo se hace</h2>
            <ol className="mt-5 grid gap-4">
              {receta.pasos.map((paso, i) => (
                <li key={paso} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="tabular mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
                  >
                    {i + 1}
                  </span>
                  <p className="leading-relaxed text-muted-foreground">{paso}</p>
                </li>
              ))}
            </ol>

            <div className="mt-12 grid gap-8 sm:grid-cols-2">
              <div>
                <h3 className="font-display text-lg tracking-[-0.01em]">Utensilios</h3>
                <ul className="mt-3 grid gap-1.5 text-sm text-muted-foreground">
                  {receta.utensilios.map((u) => (
                    <li key={u}>{u}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-display text-lg tracking-[-0.01em]">Consejos</h3>
                <ul className="mt-3 grid gap-1.5 text-sm text-muted-foreground">
                  {receta.consejos.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="mt-10 flex items-start gap-2 rounded-2xl bg-arena/60 p-4 text-sm text-muted-foreground">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <span>
                <strong className="font-medium text-foreground">Alérgenos:</strong>{" "}
                {receta.alergenos}
              </span>
            </p>
          </div>

          {/* ── Paquete de ingredientes ──────────────────────────────── */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl bg-card p-5 shadow-[var(--shadow-e2)] ring-1 ring-[var(--ring-linea)]">
              <h2 className="font-display text-xl tracking-[-0.012em]">Tu paquete</h2>

              <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-arena/60 p-3">
                <div>
                  <p className="text-sm font-medium">Raciones</p>
                  <p className="text-xs text-muted-foreground">Recalculamos las cantidades</p>
                </div>
                <div className="flex items-center gap-1 rounded-lg bg-background p-1 shadow-[var(--shadow-e1)]">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-7"
                    aria-label="Quitar una ración"
                    disabled={raciones <= 1}
                    onClick={() => setRaciones((n) => Math.max(1, n - 1))}
                  >
                    <Minus className="size-3.5" />
                  </Button>
                  <span className="tabular w-7 text-center text-sm font-semibold">{raciones}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-7"
                    aria-label="Añadir una ración"
                    disabled={raciones >= 12}
                    onClick={() => setRaciones((n) => Math.min(12, n + 1))}
                  >
                    <Plus className="size-3.5" />
                  </Button>
                </div>
              </div>

              <ul className="mt-5 grid gap-3">
                {paquete.lineas.map((linea) => {
                  const id = linea.ingrediente.productoId!;
                  return (
                    <li key={id}>
                      <label
                        className={`flex cursor-pointer gap-3 rounded-xl p-2 transition-colors duration-200 hover:bg-arena/50 ${
                          linea.disponible ? "" : "opacity-60"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={linea.elegido}
                          onChange={() => alternar(id)}
                          disabled={!linea.disponible}
                          className="mt-1 size-4 shrink-0 accent-[var(--primary)]"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="flex items-baseline justify-between gap-3">
                            <Link
                              to="/producto/$id"
                              params={{ id }}
                              className="text-sm font-medium leading-snug hover:text-primary"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {linea.producto.nombre}
                            </Link>
                            <span className="tabular shrink-0 text-sm font-semibold">
                              {formatoPrecio(linea.precio)}
                            </span>
                          </span>
                          <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                            La receta usa {cantidad(linea.necesario, linea.ingrediente.unidad)} ·
                            comprarás {linea.envases} × {linea.producto.formato}
                            {linea.sobra > 0 && (
                              <> · te sobran ≈{cantidad(linea.sobra, linea.ingrediente.unidad)}</>
                            )}
                          </span>
                          {!linea.disponible && (
                            <span className="mt-1 inline-block text-xs font-medium text-destructive">
                              Agotado ahora mismo
                            </span>
                          )}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>

              {paquete.aparte.length > 0 && (
                <div className="mt-5 border-t border-border pt-4">
                  <h3 className="text-sm font-medium">Lo pones tú</h3>
                  <ul className="mt-2 grid gap-1 text-xs text-muted-foreground">
                    {paquete.aparte.map((i) => (
                      <li key={i.nombre} className="flex justify-between gap-3">
                        <span>{i.nombre}</span>
                        <span className="tabular shrink-0">
                          {cantidad(
                            (i.cantidadPorRacion * raciones) / receta.racionesBase,
                            i.unidad,
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {paquete.basicos.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium">De tu despensa</h3>
                  <ul className="mt-2 grid gap-1 text-xs text-muted-foreground">
                    {paquete.basicos.map((i) => (
                      <li key={i.nombre}>{i.nombre}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-5 border-t border-border pt-4">
                <p className="flex items-baseline justify-between gap-3">
                  <span className="text-sm text-muted-foreground">
                    {comprables.length === 1 ? "1 producto" : `${comprables.length} productos`}
                  </span>
                  <span className="tabular font-display text-2xl tracking-[-0.015em]">
                    {formatoPrecio(paquete.total)}
                  </span>
                </p>

                <Button
                  className="mt-3 w-full gap-2 shadow-[var(--shadow-e1)] transition-[transform,box-shadow] duration-200 hover:shadow-[var(--shadow-e2)] active:translate-y-px"
                  size="lg"
                  disabled={comprables.length === 0}
                  onClick={anadirPaquete}
                >
                  <ShoppingBag className="size-4" aria-hidden="true" />
                  {paquete.completo ? "Añadir el paquete completo" : "Añadir la selección"}
                </Button>

                {/* Nunca se llama "paquete completo" a algo al que le falta una pieza. */}
                {!paquete.completo && comprables.length > 0 && (
                  <p className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground">
                    <Check className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                    Selección parcial: faltan {paquete.lineas.length - comprables.length} de{" "}
                    {paquete.lineas.length} ingredientes del paquete.
                  </p>
                )}

                {paquete.agotadas.length > 0 && (
                  <p className="mt-2 flex items-start gap-1.5 text-xs text-destructive">
                    <AlertTriangle className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                    No añadimos lo agotado ni lo sustituimos por otra cosa.
                  </p>
                )}

                <p className="mt-3 text-xs text-muted-foreground">
                  Precios y existencias de demostración hasta conectar la tienda.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
