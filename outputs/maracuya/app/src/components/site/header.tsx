import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronDown, MapPin, Menu, Search, ShoppingBag, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCarrito } from "@/components/site/cart";
import { EstimadorEntrega } from "@/components/site/entrega";
import { banderaUrl, categorias, paises, recetas, tiposReceta } from "@/lib/catalogo";
import logoUrl from "@/assets/maracuya-logo.svg";

type Hijo = {
  clave: string;
  etiqueta: string;
  to: "/tienda" | "/recetas";
  search: Record<string, unknown>;
  emoji?: string;
  bandera?: string;
};

type Seccion = {
  etiqueta: string;
  to?: "/tienda" | "/recetas" | "/tartas";
  search?: Record<string, unknown>;
  href?: string;
  /** Si los trae, la entrada se despliega en vez de navegar. */
  hijos?: Hijo[];
};

/**
 * El catálogo de secciones, compartido por la barra de escritorio y el panel.
 * Productos, Recetas y Países se despliegan; el resto son enlaces directos.
 */
const SECCIONES: Seccion[] = [
  {
    etiqueta: "Productos",
    to: "/tienda",
    search: {},
    hijos: categorias.map((c) => ({
      clave: c.id,
      etiqueta: c.nombre,
      to: "/tienda" as const,
      search: { categoria: c.id },
      emoji: c.emoji,
    })),
  },
  { etiqueta: "Ofertas", to: "/tienda", search: { oferta: true } },
  {
    etiqueta: "Recetas",
    to: "/recetas",
    search: {},
    hijos: [
      { clave: "todas", etiqueta: "Todas las recetas", to: "/recetas" as const, search: {} },
      ...tiposReceta
        .filter((t) => recetas.some((r) => r.tipo === t))
        .map((t) => ({
          clave: t,
          etiqueta: t === "Principal" ? "Platos principales" : `${t}s`,
          to: "/recetas" as const,
          search: { tipo: t },
        })),
    ],
  },
  { etiqueta: "Tartas", to: "/tartas", search: {} },
  {
    etiqueta: "Países",
    href: "/#paises",
    hijos: paises.map((p) => ({
      clave: p.id,
      etiqueta: p.nombre,
      to: "/tienda" as const,
      search: { pais: p.id },
      bandera: banderaUrl(p.codigo),
    })),
  },
  { etiqueta: "Envíos", href: "/#envios" },
];

/**
 * Una entrada que se abre. El botón es un botón de verdad, con
 * aria-expanded, para que un lector de pantalla sepa que hay algo debajo.
 */
function Desplegable({
  etiqueta,
  abierto,
  onAlternar,
  children,
}: {
  etiqueta: string;
  abierto: boolean;
  onAlternar: () => void;
  children: React.ReactNode;
}) {
  return (
    <>
      <button
        type="button"
        aria-expanded={abierto}
        onClick={onAlternar}
        className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left font-display text-lg transition-colors duration-200 hover:bg-arena hover:text-primary"
      >
        {etiqueta}
        <ChevronDown
          className={`size-4 shrink-0 text-muted-foreground transition-transform duration-300 ease-[var(--ease-out-expo)] ${
            abierto ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>
      {abierto && (
        <ul className="mb-2 ml-3 grid gap-0.5 border-l border-border pl-3">{children}</ul>
      )}
    </>
  );
}

export function Header() {
  const { unidades, setAbierto } = useCarrito();
  const [menu, setMenu] = useState(false);
  // Solo una abierta a la vez: el panel es estrecho y dos listas de ocho
  // obligan a hacer scroll para encontrar lo que se buscaba.
  const [seccionAbierta, setSeccionAbierta] = useState<string | null>(null);
  const [cp, setCp] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const navigate = useNavigate();
  const cpRef = useRef<HTMLDivElement>(null);

  // La cuenta salta cuando entra algo: el acuse de recibo de una acción que
  // ocurre lejos del cursor, al otro extremo de la cabecera.
  const [salta, setSalta] = useState(false);
  const anterior = useRef(unidades);
  useEffect(() => {
    if (unidades > anterior.current) {
      setSalta(true);
      const id = setTimeout(() => setSalta(false), 460);
      anterior.current = unidades;
      return () => clearTimeout(id);
    }
    anterior.current = unidades;
    return;
  }, [unidades]);

  // La cabecera se despega del contenido solo cuando hay contenido debajo.
  const [pegada, setPegada] = useState(false);
  useEffect(() => {
    const alScroll = () => setPegada(window.scrollY > 8);
    alScroll();
    window.addEventListener("scroll", alScroll, { passive: true });
    return () => window.removeEventListener("scroll", alScroll);
  }, []);

  useEffect(() => {
    if (!cp) return;
    const fuera = (e: MouseEvent) => {
      if (cpRef.current && !cpRef.current.contains(e.target as Node)) setCp(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setCp(false);
    document.addEventListener("mousedown", fuera);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", fuera);
      document.removeEventListener("keydown", esc);
    };
  }, [cp]);

  const buscar = (e: React.FormEvent) => {
    e.preventDefault();
    const q = busqueda.trim();
    navigate({ to: "/tienda", search: q ? { q } : {} });
    setMenu(false);
  };

  const enlaceSeccion =
    "inline-block py-1 text-foreground/85 transition-colors duration-200 hover:text-primary";

  return (
    <header className="sticky top-0 z-40">
      <div className="flex items-center justify-center gap-2 bg-primary px-4 py-2 text-center text-[0.72rem] text-primary-foreground sm:text-xs">
        <Truck className="size-3.5 shrink-0" aria-hidden="true" />
        Mercado latino online · Envíos y condiciones se confirmarán al conectar la tienda
      </div>

      <div
        className={`border-b bg-background/95 backdrop-blur transition-[box-shadow,border-color] duration-300 ${
          pegada ? "border-transparent shadow-[var(--shadow-e2)]" : "border-border/70"
        }`}
      >
        {/* Fila 1. Rejilla de tres columnas para que el logotipo quede
            centrado de verdad aunque los lados no pesen lo mismo. */}
        <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <Sheet open={menu} onOpenChange={setMenu}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="shrink-0" aria-label="Abrir el menú">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>

              <SheetContent side="left" className="w-full overflow-y-auto sm:max-w-sm">
                <SheetHeader className="text-left">
                  <SheetTitle className="font-display text-2xl">Menú</SheetTitle>
                </SheetHeader>

                <div className="space-y-7 px-4 pb-10">
                  <form onSubmit={buscar} role="search" className="relative">
                    <Search
                      className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <Input
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      placeholder="Buscar productos o marcas"
                      aria-label="Buscar productos o marcas"
                      className="pl-9"
                    />
                  </form>

                  <nav aria-label="Secciones">
                    <ul className="grid gap-0.5">
                      {SECCIONES.map((sec) =>
                        sec.hijos ? (
                          <li key={sec.etiqueta}>
                            <Desplegable
                              etiqueta={sec.etiqueta}
                              abierto={seccionAbierta === sec.etiqueta}
                              onAlternar={() =>
                                setSeccionAbierta(
                                  seccionAbierta === sec.etiqueta ? null : sec.etiqueta,
                                )
                              }
                            >
                              {sec.hijos.map((h) => (
                                <li key={h.clave}>
                                  <Link
                                    to={h.to}
                                    search={h.search}
                                    onClick={() => setMenu(false)}
                                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors duration-200 hover:bg-arena hover:text-primary"
                                  >
                                    {h.emoji && (
                                      <span aria-hidden="true" className="text-base leading-none">
                                        {h.emoji}
                                      </span>
                                    )}
                                    {h.bandera && (
                                      <img
                                        src={h.bandera}
                                        alt=""
                                        width={20}
                                        height={14}
                                        className="h-3.5 w-5 shrink-0 rounded-[2px] object-cover"
                                      />
                                    )}
                                    {h.etiqueta}
                                  </Link>
                                </li>
                              ))}
                            </Desplegable>
                          </li>
                        ) : (
                          <li key={sec.etiqueta}>
                            {sec.to ? (
                              <Link
                                to={sec.to}
                                search={sec.search ?? {}}
                                onClick={() => setMenu(false)}
                                className="block rounded-lg px-3 py-2.5 font-display text-lg transition-colors duration-200 hover:bg-arena hover:text-primary"
                              >
                                {sec.etiqueta}
                              </Link>
                            ) : (
                              <a
                                href={sec.href}
                                onClick={() => setMenu(false)}
                                className="block rounded-lg px-3 py-2.5 font-display text-lg transition-colors duration-200 hover:bg-arena hover:text-primary"
                              >
                                {sec.etiqueta}
                              </a>
                            )}
                          </li>
                        ),
                      )}
                    </ul>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>

            <form
              onSubmit={buscar}
              className="relative hidden min-w-0 flex-1 lg:block"
              role="search"
            >
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar productos o marcas"
                aria-label="Buscar productos o marcas"
                className="pl-9"
              />
            </form>
          </div>

          <Link
            to="/"
            aria-label="MARACUYA mercado latino — ir al inicio"
            className="justify-self-center"
          >
            <img src={logoUrl} alt="MARACUYA mercado latino" className="h-9 w-auto sm:h-11" />
          </Link>

          <div className="flex items-center justify-end gap-1">
            <div className="relative" ref={cpRef}>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 px-2"
                aria-expanded={cp}
                onClick={() => setCp((v) => !v)}
              >
                <MapPin className="size-4" aria-hidden="true" />
                <span className="hidden xl:inline">Código postal</span>
              </Button>
              {cp && (
                <div className="absolute right-0 top-11 z-50 w-72 rounded-2xl bg-card p-4 shadow-[var(--shadow-e3)] ring-1 ring-[var(--ring-linea)]">
                  <EstimadorEntrega compacto />
                </div>
              )}
            </div>

            <Button
              variant="outline"
              className="shrink-0 gap-2 px-3 transition-[transform,box-shadow] duration-200 hover:shadow-[var(--shadow-e1)] active:translate-y-px"
              onClick={() => setAbierto(true)}
              aria-label="Abrir la cesta"
            >
              <ShoppingBag className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">Cesta</span>
              <span
                className={`tabular rounded-full bg-maracuya px-2 text-xs font-semibold text-maracuya-foreground ${
                  salta ? "mrc-bump" : ""
                }`}
              >
                {unidades}
              </span>
            </Button>
          </div>
        </div>

        {/* Fila 2. El catálogo vive debajo del nombre, como la marquesina de
            un puesto de mercado. En móvil el mismo contenido está en el panel. */}
        <nav
          aria-label="Secciones de la tienda"
          className="hidden border-t border-border/60 lg:block"
        >
          <ul className="mx-auto flex max-w-6xl items-center justify-center gap-9 px-4 py-2.5 text-sm font-medium uppercase tracking-[0.07em]">
            {SECCIONES.map((sec) => (
              <li key={sec.etiqueta}>
                {sec.to ? (
                  <Link
                    to={sec.to}
                    search={sec.search ?? {}}
                    className={enlaceSeccion}
                    activeProps={{ className: "text-primary" }}
                  >
                    {sec.etiqueta}
                  </Link>
                ) : (
                  <a href={sec.href} className={enlaceSeccion}>
                    {sec.etiqueta}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
