/**
 * Cliente de la Storefront API de Shopify.
 *
 * Solo usa el token PÚBLICO. La documentación de Shopify es explícita: el
 * token privado debe tratarse como secreto y no usarse en el lado del
 * cliente. Como todo lo que empieza por VITE_ acaba dentro del bundle que
 * descarga el navegador, aquí no puede entrar ningún secreto.
 *
 * Cabecera correcta para el token público: X-Shopify-Storefront-Access-Token.
 * (La del privado sería Shopify-Storefront-Private-Token, y va de servidor.)
 */

const dominio = import.meta.env["VITE_SHOPIFY_STORE_DOMAIN"];
const token = import.meta.env["VITE_SHOPIFY_STOREFRONT_TOKEN"];
const version = import.meta.env["VITE_SHOPIFY_API_VERSION"] ?? "2025-10";

/** Verdadero cuando hay credenciales configuradas. Sin esto, la web sigue
 *  funcionando con el catálogo local y lo dice, en vez de romperse. */
export const shopifyConfigurado = Boolean(dominio && token);

export class ErrorShopify extends Error {
  constructor(
    message: string,
    readonly detalles?: unknown,
  ) {
    super(message);
    this.name = "ErrorShopify";
  }
}

type Respuesta<T> = {
  data?: T;
  errors?: { message: string }[];
};

export async function consultarShopify<T>(
  query: string,
  variables: Record<string, unknown> = {},
  señal?: AbortSignal,
): Promise<T> {
  if (!shopifyConfigurado) {
    throw new ErrorShopify(
      "Falta la configuración de Shopify. Copia .env.example a .env.local y rellena el dominio y el token público.",
    );
  }

  let respuesta: Response;
  try {
    respuesta = await fetch(`https://${dominio}/api/${version}/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token as string,
      },
      body: JSON.stringify({ query, variables }),
      ...(señal ? { signal: señal } : {}),
    });
  } catch (causa) {
    // Sin red, o el dominio no resuelve. Se distingue de un error de la API
    // porque la recuperación es distinta: reintentar frente a corregir.
    throw new ErrorShopify("No hemos podido conectar con la tienda.", causa);
  }

  if (!respuesta.ok) {
    throw new ErrorShopify(
      `La tienda respondió ${respuesta.status}.`,
      await respuesta.text().catch(() => undefined),
    );
  }

  const cuerpo = (await respuesta.json()) as Respuesta<T>;

  // La Storefront API devuelve 200 con errores dentro del cuerpo, así que un
  // `ok` no basta para dar la respuesta por buena.
  if (cuerpo.errors?.length) {
    throw new ErrorShopify(cuerpo.errors.map((e) => e.message).join(" · "), cuerpo.errors);
  }
  if (!cuerpo.data) {
    throw new ErrorShopify("La tienda respondió sin datos.");
  }

  return cuerpo.data;
}

/** Consulta mínima para comprobar que las credenciales son válidas. */
export const CONSULTA_DIAGNOSTICO = /* GraphQL */ `
  query Diagnostico {
    shop {
      name
      primaryDomain {
        url
      }
    }
    products(first: 1) {
      nodes {
        id
      }
    }
  }
`;
