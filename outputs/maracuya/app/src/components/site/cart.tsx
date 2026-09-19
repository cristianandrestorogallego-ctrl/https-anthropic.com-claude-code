import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { MessageCircle, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { enlaceWhatsapp } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatoPrecio, type Producto } from "@/lib/catalogo";

type Linea = { producto: Producto; cantidad: number };

type CarritoContexto = {
  lineas: Linea[];
  unidades: number;
  total: number;
  abierto: boolean;
  setAbierto: (v: boolean) => void;
  agregar: (producto: Producto, cantidad?: number) => void;
  cambiar: (id: string, delta: number) => void;
  quitar: (id: string) => void;
};

const Ctx = createContext<CarritoContexto | null>(null);

export function useCarrito() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCarrito debe usarse dentro de CarritoProvider");
  return ctx;
}

const ENVIO_GRATIS = 49;

export function CarritoProvider({ children }: { children: ReactNode }) {
  const [lineas, setLineas] = useState<Linea[]>([]);
  const [abierto, setAbierto] = useState(false);

  const valor = useMemo<CarritoContexto>(() => {
    const unidades = lineas.reduce((a, l) => a + l.cantidad, 0);
    const total = lineas.reduce((a, l) => a + l.cantidad * l.producto.precio, 0);
    return {
      lineas,
      unidades,
      total,
      abierto,
      setAbierto,
      agregar: (producto, cantidad = 1) => {
        const suma = Math.max(1, Math.trunc(cantidad));
        setLineas((prev) => {
          const existe = prev.find((l) => l.producto.id === producto.id);
          if (existe) {
            return prev.map((l) =>
              l.producto.id === producto.id ? { ...l, cantidad: l.cantidad + suma } : l,
            );
          }
          return [...prev, { producto, cantidad: suma }];
        });
        setAbierto(true);
      },
      cambiar: (id, delta) =>
        setLineas((prev) =>
          prev
            .map((l) => (l.producto.id === id ? { ...l, cantidad: l.cantidad + delta } : l))
            .filter((l) => l.cantidad > 0),
        ),
      quitar: (id) => setLineas((prev) => prev.filter((l) => l.producto.id !== id)),
    };
  }, [lineas, abierto]);

  return (
    <Ctx.Provider value={valor}>
      {children}
      <CarritoPanel />
    </Ctx.Provider>
  );
}

function CarritoPanel() {
  const { lineas, total, abierto, setAbierto, cambiar, quitar } = useCarrito();
  const falta = Math.max(0, ENVIO_GRATIS - total);

  /** El pedido en texto plano, para mandarlo tal cual. */
  const mensajePedido = () =>
    [
      "Hola, quiero hacer este pedido en MARACUYA:",
      "",
      ...lineas.map((l) => `· ${l.cantidad} × ${l.producto.nombre} (${l.producto.formato})`),
      "",
      `Total orientativo: ${formatoPrecio(total)}`,
      "",
      "¿Me confirmáis disponibilidad y envío?",
    ].join("\n");

  return (
    <Sheet open={abierto} onOpenChange={setAbierto}>
      <SheetContent className="flex w-full flex-col gap-0 sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl">Tu cesta</SheetTitle>
          <SheetDescription>
            {falta > 0
              ? `Te faltan ${formatoPrecio(falta)} para el envío gratis en península.`
              : "¡Envío gratis conseguido en península!"}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-2">
          {lineas.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-16 text-center text-muted-foreground">
              <ShoppingBag className="size-8" />
              <p className="text-sm">Todavía no has añadido nada del mercado.</p>
            </div>
          )}

          {lineas.map(({ producto, cantidad }) => (
            <div key={producto.id} className="flex gap-3 rounded-xl border bg-card p-3">
              <img
                src={producto.imagen}
                alt={producto.nombre}
                loading="lazy"
                className="size-16 shrink-0 rounded-lg object-cover"
              />
              <div className="flex-1">
                <p className="text-sm font-medium leading-tight">{producto.nombre}</p>
                <p className="text-xs text-muted-foreground">
                  {producto.marca} · {producto.formato}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    className="size-7"
                    aria-label="Quitar una unidad"
                    onClick={() => cambiar(producto.id, -1)}
                  >
                    <Minus className="size-3" />
                  </Button>
                  <span className="w-6 text-center text-sm">{cantidad}</span>
                  <Button
                    size="icon"
                    variant="outline"
                    className="size-7"
                    aria-label="Añadir una unidad"
                    onClick={() => cambiar(producto.id, 1)}
                  >
                    <Plus className="size-3" />
                  </Button>
                  <span className="ml-auto text-sm font-semibold">
                    {formatoPrecio(producto.precio * cantidad)}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-7 text-muted-foreground"
                    aria-label="Eliminar producto"
                    onClick={() => quitar(producto.id)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3 border-t p-4">
          <div className="flex items-center justify-between text-base">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-display text-xl">{formatoPrecio(total)}</span>
          </div>
          <Button className="w-full" size="lg" disabled={lineas.length === 0}>
            Finalizar compra
          </Button>
          {/* Mientras el pago no esté activado, esta es la vía que sí
              funciona: el pedido llega escrito, no se pierde. */}
          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full gap-2 border-leaf/50 text-leaf hover:bg-leaf/10 hover:text-leaf"
            disabled={lineas.length === 0}
          >
            <a
              href={enlaceWhatsapp(mensajePedido())}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={lineas.length === 0}
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              Pedir por WhatsApp
            </a>
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Pago y envío se activarán al conectar la tienda.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
