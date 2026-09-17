import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Check, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCarrito } from "@/components/site/cart";
import { formatoPrecio, type Producto } from "@/lib/catalogo";

export function ProductCard({ producto }: { producto: Producto }) {
  const { agregar } = useCarrito();
  const [anadido, setAnadido] = useState(false);
  const temporizador = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(temporizador.current), []);

  function anadir() {
    agregar(producto);
    setAnadido(true);
    clearTimeout(temporizador.current);
    temporizador.current = setTimeout(() => setAnadido(false), 1400);
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-card text-card-foreground shadow-[var(--shadow-e1)] ring-1 ring-[oklch(0.27_0.06_158_/_0.08)] transition-[transform,box-shadow] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:shadow-[var(--shadow-e3)]">
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
          className="size-full object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.06]"
        />
        {producto.etiqueta && (
          <span className="absolute left-3 top-3 rounded-full bg-maracuya px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-wide text-maracuya-foreground shadow-[var(--shadow-e1)]">
            {producto.etiqueta}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-display text-lg leading-snug tracking-[-0.01em]">
          <Link
            to="/producto/$id"
            params={{ id: producto.id }}
            className="transition-colors duration-200 hover:text-primary"
          >
            {producto.nombre}
          </Link>
        </h3>
        <p className="text-sm text-muted-foreground">
          {producto.origen} · {producto.formato}
        </p>
        <p className="line-clamp-2 text-sm text-muted-foreground">{producto.descripcion}</p>

        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="tabular font-display text-xl tracking-[-0.01em]">
            {formatoPrecio(producto.precio)}
          </span>
          <Button
            size="sm"
            className="gap-1 transition-[transform,box-shadow] duration-200 active:translate-y-px"
            aria-label={`Añadir ${producto.nombre} a la cesta`}
            onClick={anadir}
          >
            {anadido ? (
              <>
                <Check className="size-4" aria-hidden="true" />
                Añadido
              </>
            ) : (
              <>
                <Plus className="size-4" aria-hidden="true" />
                Añadir
              </>
            )}
          </Button>
        </div>
      </div>
    </article>
  );
}
