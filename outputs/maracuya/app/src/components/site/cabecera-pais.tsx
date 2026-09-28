import { banderaUrl, type Pais } from "@/lib/catalogo";

/**
 * La cabecera de una página de país.
 *
 * Antes era un título negro sobre crema, igual que el de cualquier otro
 * filtro: entrar en Colombia y entrar en "Ofertas" se veían idénticos.
 * Ahora el país se reconoce antes de leer nada.
 *
 * Cómo está hecho, y por qué así:
 *
 * El fondo NO son los colores de la bandera puestos tal cual. Son esos
 * colores mezclados contra el fondo de la página con `color-mix`, al 16 %.
 * Eso resuelve dos cosas de una vez. Sobre un tinte pálido el texto sigue
 * siendo la tinta de siempre, así que el contraste no depende de qué país
 * sea —una franja roja y una amarilla no admiten el mismo color de letra—.
 * Y como la mezcla es contra `var(--card)`, en modo oscuro el tinte se
 * oscurece solo y el contraste aguanta sin una segunda paleta.
 *
 * El color de verdad, sin diluir, va donde no hay texto encima: la banda
 * de abajo. Ahí puede ser exacto porque no tiene que dejar leer nada.
 */
export function CabeceraPais({ pais }: { pais: Pais }) {
  // El tinte no es parejo: arranca flojo, donde está el titular, y se va
  // cargando hacia la derecha, donde no hay nada que leer. Así el color
  // puede ser de verdad sin pelearse con el texto, y un celeste pálido
  // llega a notarse tanto como un rojo, que con un porcentaje fijo no
  // pasaba: Argentina quedaba casi en blanco al lado de Perú.
  const FLOJO = 9;
  const FUERTE = 38;
  const n = pais.colores.length;
  const parada = (c: string, fuerza: number, posicion: number) =>
    `color-mix(in oklab, ${c} ${fuerza}%, var(--card)) ${posicion}%`;

  const tinte =
    n === 1
      ? [parada(pais.colores[0], FLOJO, 0), parada(pais.colores[0], FUERTE, 100)].join(", ")
      : pais.colores
          .map((c, i) => parada(c, FLOJO + ((FUERTE - FLOJO) * i) / (n - 1), (i / (n - 1)) * 100))
          .join(", ");

  // La banda inferior, a franjas duras: cada color ocupa su tramo exacto
  // en vez de degradar al siguiente, que es como se lee una bandera.
  const franjas = pais.colores
    .map((c, i) => {
      const paso = 100 / pais.colores.length;
      return `${c} ${i * paso}% ${(i + 1) * paso}%`;
    })
    .join(", ");

  return (
    <div
      className="relative overflow-hidden rounded-2xl shadow-[var(--shadow-e1)] ring-1 ring-[var(--ring-linea)]"
      style={{ background: `linear-gradient(115deg, ${tinte})` }}
    >
      <div className="flex items-center gap-5 px-6 py-8 sm:gap-7 sm:px-10 sm:py-11">
        {/* La bandera como objeto, no como icono: tiene grosor, borde y
            sombra, igual que las tarjetas del resto del sitio. */}
        <img
          src={banderaUrl(pais.codigo)}
          alt=""
          width={112}
          height={75}
          loading="lazy"
          className="h-12 w-auto shrink-0 rounded-md shadow-[var(--shadow-e2)] ring-1 ring-black/10 sm:h-16"
        />
        <div className="min-w-0">
          <h1 className="font-display text-3xl tracking-[-0.025em] sm:text-5xl">
            Productos de {pais.nombre}
          </h1>
          <p className="mt-2 max-w-xl leading-relaxed text-muted-foreground">{pais.nota}</p>
        </div>
      </div>
      {/* Aquí el color va puro: no hay nada que leer encima. */}
      <div
        aria-hidden="true"
        className="h-2 w-full"
        style={{ background: `linear-gradient(90deg, ${franjas})` }}
      />
    </div>
  );
}
