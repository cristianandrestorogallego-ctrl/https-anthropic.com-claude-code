import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Menu, ShoppingBag, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCarrito } from "@/components/site/cart";
import logoUrl from "@/assets/maracuya-logo.svg";

const enlaces = [
  { label: "Tienda", to: "/tienda" as const },
  { label: "Categorías", href: "/#categorias" },
  { label: "Nuestra historia", href: "/#historia" },
  { label: "Envíos", href: "/#envios" },
];

export function Header() {
  const { unidades, setAbierto } = useCarrito();
  const [menuAbierto, setMenuAbierto] = useState(false);

  // La cuenta salta cuando entra algo: es el acuse de recibo de una acción
  // que ocurre lejos del cursor, al otro extremo de la cabecera.
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

  return (
    <header className="sticky top-0 z-40">
      <div className="flex items-center justify-center gap-2 bg-selva px-4 py-2 text-center text-xs text-selva-foreground">
        <Truck className="size-3.5 shrink-0" aria-hidden="true" />
        Envíos a toda España en 24-72 h · Gratis desde 49 €
      </div>
      <div
        className={`border-b bg-background/85 backdrop-blur-md transition-[box-shadow,border-color] duration-300 ${
          pegada ? "border-transparent shadow-[var(--shadow-e2)]" : "border-border/70"
        }`}
      >
        <nav className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3">
          <Link to="/" aria-label="MARACUYA mercado latino — ir al inicio">
            <img src={logoUrl} alt="MARACUYA mercado latino" className="h-9 w-auto sm:h-10" />
          </Link>

          <div className="ml-auto hidden items-center gap-6 text-sm md:flex">
            {enlaces.map((e) =>
              e.to ? (
                <Link
                  key={e.label}
                  to={e.to}
                  search={{}}
                  className="transition-colors duration-200 hover:text-primary"
                  activeProps={{ className: "text-primary font-medium" }}
                >
                  {e.label}
                </Link>
              ) : (
                <a
                  key={e.label}
                  href={e.href}
                  className="transition-colors duration-200 hover:text-primary"
                >
                  {e.label}
                </a>
              ),
            )}
          </div>

          {/* En móvil los enlaces viven en un panel: sin esto la cabecera
              se queda sin navegación por debajo de md. */}
          <Sheet open={menuAbierto} onOpenChange={setMenuAbierto}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto md:hidden"
                aria-label="Abrir el menú"
              >
                <Menu className="size-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <SheetHeader className="text-left">
                <SheetTitle className="font-display text-2xl">Menú</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 grid gap-1 px-4">
                {enlaces.map((e) =>
                  e.to ? (
                    <Link
                      key={e.label}
                      to={e.to}
                      search={{}}
                      onClick={() => setMenuAbierto(false)}
                      className="rounded-lg px-3 py-3 font-display text-lg transition-colors duration-200 hover:bg-arena hover:text-primary"
                    >
                      {e.label}
                    </Link>
                  ) : (
                    <a
                      key={e.label}
                      href={e.href}
                      onClick={() => setMenuAbierto(false)}
                      className="rounded-lg px-3 py-3 font-display text-lg transition-colors duration-200 hover:bg-arena hover:text-primary"
                    >
                      {e.label}
                    </a>
                  ),
                )}
              </nav>
            </SheetContent>
          </Sheet>

          <Button
            variant="outline"
            className="gap-2 transition-[transform,box-shadow] duration-200 hover:shadow-[var(--shadow-e1)] active:translate-y-px"
            onClick={() => setAbierto(true)}
          >
            <ShoppingBag className="size-4" aria-hidden="true" />
            Cesta
            <span
              className={`tabular rounded-full bg-maracuya px-2 text-xs font-semibold text-maracuya-foreground ${
                salta ? "mrc-bump" : ""
              }`}
            >
              {unidades}
            </span>
          </Button>
        </nav>
      </div>
    </header>
  );
}
