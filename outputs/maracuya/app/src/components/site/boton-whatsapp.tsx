import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { enlaceWhatsapp } from "@/lib/whatsapp";

/**
 * El logotipo de WhatsApp.
 *
 * Es la marca de verdad, no un bocadillo genérico: si el botón dice "pedir
 * por WhatsApp", lo que se reconoce de un vistazo es este perfil. Hereda el
 * color del texto, así que sirve igual en el botón verde y en el pie oscuro.
 */
export function IconoWhatsapp({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={cn("size-4", className)}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.347-.347.52-.52.174-.174.232-.298.347-.497.115-.199.057-.372-.058-.521-.115-.148-.652-1.572-.893-2.146-.235-.563-.474-.487-.651-.496l-.555-.01c-.193 0-.506.073-.771.372-.265.297-1.012.986-1.012 2.406 0 1.42 1.035 2.793 1.18 2.987.144.195 2.031 3.1 4.921 4.35.688.298 1.226.476 1.645.609.706.224 1.35.192 1.858.115.57-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.174-1.414-.074-.124-.272-.198-.57-.347zM12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.002-5.45 4.437-9.884 9.888-9.884a9.82 9.82 0 0 1 6.988 2.898 9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.886 9.884zm8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0 0 20.463 3.488z" />
    </svg>
  );
}

type BotonWhatsappProps = {
  /** El texto con el que se abre la conversación, ya redactado. */
  mensaje: string;
  /** Lo que dice el botón. Por defecto, lo de siempre. */
  children?: React.ReactNode;
  className?: string;
  /** Sin nada que pedir todavía: el enlace sigue ahí, pero no invita. */
  desactivado?: boolean;
};

/**
 * El botón verde de WhatsApp.
 *
 * Vive en un sitio solo para que el carrito, las tartas y cualquier otro
 * punto de la tienda abran WhatsApp con la misma pinta y el mismo verde.
 */
export function BotonWhatsapp({
  mensaje,
  children = "Pedir por WhatsApp",
  className,
  desactivado = false,
}: BotonWhatsappProps) {
  return (
    <Button
      asChild
      size="lg"
      className={cn(
        "gap-2 bg-whatsapp text-whatsapp-foreground shadow-sm hover:bg-whatsapp-hover",
        desactivado && "pointer-events-none opacity-50",
        className,
      )}
    >
      <a
        href={enlaceWhatsapp(mensaje)}
        target="_blank"
        rel="noopener noreferrer"
        aria-disabled={desactivado || undefined}
      >
        <IconoWhatsapp />
        {children}
      </a>
    </Button>
  );
}
