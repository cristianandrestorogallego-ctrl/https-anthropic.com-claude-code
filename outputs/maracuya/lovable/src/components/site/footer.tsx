import { Link } from "@tanstack/react-router";

import logoAsset from "@/assets/logo.asset.json";

export function Footer() {
  return (
    <footer className="mt-24 bg-selva text-selva-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <span className="inline-block rounded-lg bg-background px-4 py-2">
            <img src={logoAsset.url} alt="MARACUYA mercado latino" className="h-10 w-auto" />
          </span>
          <p className="mt-4 max-w-xs text-sm opacity-80">
            Productos de América Latina seleccionados uno a uno para las cocinas de España.
          </p>
        </div>
        <div className="space-y-2 text-sm opacity-85">
          <p className="font-medium opacity-100">Comprar</p>
          <p>
            <Link to="/tienda" search={{}} className="hover:underline">
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
          <p>hola@maracuya.es</p>
          <p>Devoluciones en 14 días</p>
        </div>
        <div className="space-y-2 text-sm opacity-85">
          <p className="font-medium opacity-100">Recibe recetas</p>
          <p>Ideas de cocina latina y novedades del mercado, una vez al mes.</p>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs opacity-60">
        © {new Date().getFullYear()} MARACUYA mercado latino · Hecho con sabor en España
      </div>
    </footer>
  );
}
