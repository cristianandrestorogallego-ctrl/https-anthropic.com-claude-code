import { Link } from "@tanstack/react-router";

import { Reveal, stagger } from "@/components/site/reveal";
import { banderaUrl, marcas, paisPorId } from "@/lib/catalogo";

/**
 * Marcas colaboradoras.
 *
 * Sin logotipos. Los nombres son de demostración, y un logotipo dibujado
 * daría a entender que esas empresas existen. Cada baldosa es tipografía:
 * cuando haya proveedores reales, entra su logotipo con su permiso y la
 * baldosa lo enseña en lugar del nombre compuesto.
 */
export function Marcas() {
  return (
    <section
      id="marcas"
      aria-labelledby="marcas-titulo"
      className="scroll-mt-24 border-y border-border bg-card py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="marcas-titulo" className="font-display text-3xl tracking-[-0.02em] sm:text-4xl">
              Marcas colaboradoras
            </h2>
            <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">
              Las casas con las que trabajamos, cada una por lo que hace bien. Nombres de
              demostración hasta que cerremos con los proveedores reales.
            </p>
          </div>
        </div>

        <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {marcas.map((m, i) => {
            const pais = paisPorId(m.pais);
            return (
              <li key={m.nombre}>
                <Reveal delay={stagger(i, 45)}>
                  <Link
                    to="/tienda"
                    search={{ pais: m.pais }}
                    className="group flex h-full flex-col gap-1.5 rounded-2xl bg-background px-5 py-5 shadow-[var(--shadow-e1)] ring-1 ring-[var(--ring-linea)] transition-[transform,box-shadow] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:shadow-[var(--shadow-e3)]"
                  >
                    {m.logo ? (
                      <img
                        src={m.logo}
                        alt={m.nombre}
                        loading="lazy"
                        className="h-10 w-auto self-start object-contain"
                      />
                    ) : (
                      <span className="font-display text-xl leading-tight tracking-[-0.015em] text-foreground transition-colors duration-200 group-hover:text-primary">
                        {m.nombre}
                      </span>
                    )}

                    <span className="flex items-center gap-2 text-sm text-muted-foreground">
                      {pais && (
                        <img
                          src={banderaUrl(pais.codigo)}
                          alt=""
                          width={20}
                          height={14}
                          loading="lazy"
                          className="h-3.5 w-5 shrink-0 rounded-[2px] object-cover"
                        />
                      )}
                      {m.especialidad}
                    </span>
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
