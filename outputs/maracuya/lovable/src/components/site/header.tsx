import { Link } from "@tanstack/react-router";
import { ShoppingBag, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCarrito } from "@/components/site/cart";
import logoAsset from "@/assets/logo.asset.json";

export function Header() {
  const { unidades, setAbierto } = useCarrito();

  return (
    <header className="sticky top-0 z-40">
      <div className="flex items-center justify-center gap-2 bg-selva px-4 py-2 text-center text-xs text-selva-foreground">
        <Truck className="size-3.5" />
        Envíos a toda España en 24-72 h · Gratis desde 49 €
      </div>
      <div className="border-b border-border/70 bg-background/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3">
          <Link to="/" aria-label="MARACUYA mercado latino — ir al inicio">
            <img
              src={logoAsset.url}
              alt="MARACUYA mercado latino"
              className="h-9 w-auto sm:h-10"
            />
          </Link>

          <div className="ml-auto hidden items-center gap-6 text-sm md:flex">
            <Link
              to="/tienda"
              className="transition-colors hover:text-primary"
              activeProps={{ className: "text-primary font-medium" }}
            >
              Tienda
            </Link>
            <a href="/#categorias" className="transition-colors hover:text-primary">
              Categorías
            </a>
            <a href="/#historia" className="transition-colors hover:text-primary">
              Nuestra historia
            </a>
            <a href="/#envios" className="transition-colors hover:text-primary">
              Envíos
            </a>
          </div>

          <Button
            variant="outline"
            className="ml-auto gap-2 md:ml-0"
            onClick={() => setAbierto(true)}
          >
            <ShoppingBag className="size-4" />
            Cesta
            <span className="rounded-full bg-maracuya px-2 text-xs font-semibold text-maracuya-foreground">
              {unidades}
            </span>
          </Button>
        </nav>
      </div>
    </header>
  );
}
