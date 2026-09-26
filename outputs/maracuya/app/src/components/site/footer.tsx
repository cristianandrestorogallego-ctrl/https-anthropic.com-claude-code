import { Link } from "@tanstack/react-router";
import { Mail } from "lucide-react";

import { Boletin } from "@/components/site/boletin";
import { IconoWhatsapp } from "@/components/site/boton-whatsapp";
import { CADENCIA } from "@/lib/boletin";
import { CORREO, enlaceCorreo } from "@/lib/contacto";
import { WHATSAPP_VISIBLE, enlaceWhatsapp } from "@/lib/whatsapp";

import logoUrl from "@/assets/maracuya-logo.svg";

export function Footer() {
  return (
    <footer className="mt-24 bg-selva text-selva-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <span className="inline-block rounded-lg bg-background px-4 py-2">
            <img src={logoUrl} alt="MARACUYA mercado latino" className="h-10 w-auto" />
          </span>
          <p className="mt-4 max-w-xs text-sm opacity-80">
            Productos de América Latina seleccionados uno a uno para las cocinas de España.
          </p>
        </div>
        <div className="space-y-2 text-sm opacity-85">
          <p className="font-medium opacity-100">Comprar</p>
          <p>
            <Link to="/tienda" className="hover:underline">
              Todo el catálogo
            </Link>
          </p>
          <p>
            <a href="/#categorias" className="hover:underline">
              Categorías
            </a>
          </p>
          <p>
            <a href="/#envios" className="hover:underline">
              Envíos y entregas
            </a>
          </p>
        </div>
        <div className="space-y-2 text-sm opacity-85">
          <p className="font-medium opacity-100">Ayuda</p>
          <p>Atención en español</p>
          <p>
            <a
              href={enlaceWhatsapp("Hola, tengo una consulta sobre MARACUYA.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:underline"
            >
              <IconoWhatsapp className="size-3.5 text-whatsapp-marca" />
              WhatsApp {WHATSAPP_VISIBLE}
            </a>
          </p>
          <p>
            <a
              href={enlaceCorreo("Consulta desde la web")}
              className="inline-flex items-center gap-1.5 hover:underline"
            >
              <Mail className="size-3.5" aria-hidden="true" />
              {CORREO}
            </a>
          </p>
          <p>Devoluciones en 14 días</p>
        </div>
        {/* Esta columna no lleva opacidad en el contenedor: la de CSS se
            multiplica hacia dentro y no hay forma de recuperarla desde un
            hijo, así que dejaba el botón del boletín en marrón apagado. */}
        <div className="space-y-3 text-sm">
          <p className="font-medium">Recibe recetas</p>
          <p className="opacity-85">Ideas de cocina latina y novedades del mercado, {CADENCIA}.</p>
          <Boletin />
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs opacity-60">
        © {new Date().getFullYear()} MARACUYA mercado latino · Hecho con sabor en España
      </div>
    </footer>
  );
}
