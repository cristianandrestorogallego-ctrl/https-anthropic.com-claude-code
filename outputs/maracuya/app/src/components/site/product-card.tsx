import { Plus, Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCarrito } from "@/components/site/cart";
import { banderaUrl, formatoPrecio, paisPorId, type Producto } from "@/lib/catalogo";

export function ProductCard({ producto }: { producto: Producto }) {
  const { agregar } = useCarrito();
  const pais = paisPorId(producto.pais);
  const conOferta = typeof producto.precioAnterior === "number";
  const descuento = conOferta
    ? Math.round((1 - producto.precio / producto.precioAnterior!) * 100)
    : 0;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border bg-card transition-shadow hover:shadow-[var(--shadow-soft)]">
      <div className="relative aspect-4/5 overflow-hidden bg-arena">
        <img
          src={producto.imagen}
          alt={producto.nombre}
          loading="lazy"
          className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {producto.etiqueta && (
          <span className="absolute left-3 top-3 rounded-full bg-maracuya px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-wide text-maracuya-foreground">
            {producto.etiqueta}
          </span>
        )}
        {conOferta && (
          <span className="absolute right-3 top-3 rounded-full bg-hibisco px-3 py-1 text-[0.7rem] font-semibold text-hibisco-foreground">
            -{descuento}%
          </span>
        )}
        {!producto.disponible && (
          <span className="absolute inset-x-0 bottom-0 bg-foreground/80 py-1.5 text-center text-xs font-medium text-background">
            Sin existencias
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
          <img
            src={banderaUrl(pais.codigo)}
            alt=""
            width={20}
            height={14}
            loading="lazy"
            className="h-3.5 w-5 rounded-[2px] object-cover"
          />
          {pais.nombre} · {producto.formato}
        </p>
        <h3 className="font-display text-lg leading-snug">{producto.nombre}</h3>
        <p className="text-xs text-muted-foreground">{producto.marca}</p>
        <p className="line-clamp-2 text-sm text-muted-foreground">{producto.descripcion}</p>

        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <div>
            {conOferta && (
              <span className="mr-2 text-sm text-muted-foreground line-through">
                {formatoPrecio(producto.precioAnterior!)}
              </span>
            )}
            <span className="font-display text-xl">{formatoPrecio(producto.precio)}</span>
          </div>
          <Button
            size="sm"
            className="gap-1"
            disabled={!producto.disponible}
            onClick={() => agregar(producto)}
          >
            {producto.variantes ? (
              <>
                <Settings2 className="size-4" />
                Elegir opciones
              </>
            ) : (
              <>
                <Plus className="size-4" />
                Añadir
              </>
            )}
          </Button>
        </div>
      </div>
    </article>
  );
}
