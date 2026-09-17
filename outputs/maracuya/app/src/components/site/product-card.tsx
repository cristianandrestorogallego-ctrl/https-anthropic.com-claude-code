import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCarrito } from "@/components/site/cart";
import { formatoPrecio, type Producto } from "@/lib/catalogo";

export function ProductCard({ producto }: { producto: Producto }) {
  const { agregar } = useCarrito();

  return (
    <article className="group overflow-hidden rounded-2xl border bg-card transition-shadow hover:shadow-[var(--shadow-soft)]">
      <Link
        to="/producto/$id"
        params={{ id: producto.id }}
        className="relative block aspect-4/5 overflow-hidden bg-arena"
        tabIndex={-1}
        aria-hidden="true"
      >
        <img
          src={producto.imagen}
          alt=""
          loading="lazy"
          className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {producto.etiqueta && (
          <span className="absolute left-3 top-3 rounded-full bg-maracuya px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-wide text-maracuya-foreground">
            {producto.etiqueta}
          </span>
        )}
      </Link>
      <div className="space-y-2 p-4">
        <p className="text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
          {producto.origen} · {producto.formato}
        </p>
        <h3 className="font-display text-lg leading-snug">
          <Link
            to="/producto/$id"
            params={{ id: producto.id }}
            className="transition-colors hover:text-primary"
          >
            {producto.nombre}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{producto.descripcion}</p>
        <div className="flex items-center justify-between pt-2">
          <span className="font-display text-xl">{formatoPrecio(producto.precio)}</span>
          <Button
            size="sm"
            className="gap-1"
            aria-label={`Añadir ${producto.nombre} a la cesta`}
            onClick={() => agregar(producto)}
          >
            <Plus className="size-4" />
            Añadir
          </Button>
        </div>
      </div>
    </article>
  );
}
