/**
 * Dar de alta un contacto en la lista del boletín.
 *
 * Vive aparte porque lo usan dos sitios: el formulario del pie, donde
 * apuntarse es lo único que se hace, y el de tartas, donde es una casilla
 * opcional al final. Las reglas del alta —a qué lista va, qué se
 * considera un sí, qué hacer si Brevo se queja— tienen que ser las mismas
 * en los dos, y la forma de asegurarlo es que solo estén escritas una vez.
 *
 * Solo corre en el servidor: la clave de Brevo nunca sale de ahí.
 */

/** La misma clave que manda los correos de las tartas. */
export const CLAVE_BREVO = () => process.env["BREVO_API_KEY"];

/**
 * La lista de Brevo donde caen los suscriptores, por su número.
 *
 * Sin ella no se da de alta a nadie: mandar el contacto sin lista lo
 * guardaría en Brevo sin pertenecer a nada, y el boletín nunca le
 * llegaría.
 */
export function listaBoletin(): number | null {
  const n = Number(process.env["BREVO_LISTA_RECETAS"]);
  return Number.isInteger(n) && n > 0 ? n : null;
}

export type ResultadoAlta =
  { estado: "alta" } | { estado: "sin-configurar" } | { estado: "error"; pista: string };

/** Por qué se quejó Brevo, dicho para quien lo tenga que arreglar. */
function queHacer(estado: number, code: string, message: string): string {
  const texto = `${code} ${message}`.toLowerCase();
  // Con frontera de palabra: "recipient" lleva "ip" dentro.
  if (/\bip\b/.test(texto))
    return (
      "La IP del servidor no está autorizada en Brevo, y Vercel no tiene una fija. " +
      "Desactiva el bloqueo por IP para la API: Settings → Security → Authorized IPs."
    );
  if (texto.includes("list") || estado === 404)
    return "Revisa BREVO_LISTA_RECETAS en Vercel: ese número de lista no existe en Brevo.";
  if (estado === 401 || estado === 403)
    return "Revisa BREVO_API_KEY en Vercel: falta, está mal copiada o se ha revocado.";
  return "Fallo del proveedor de correo.";
}

export async function altaEnBoletin(correo: string): Promise<ResultadoAlta> {
  const clave = CLAVE_BREVO();
  const id = listaBoletin();
  if (!clave || id === null) return { estado: "sin-configurar" };

  let respuesta: Response;
  try {
    respuesta = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": clave,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        email: correo,
        listIds: [id],
        // Con esto, quien ya estaba no da error: Brevo actualiza el
        // contacto y responde 204 en vez de 201. Las dos son un sí.
        updateEnabled: true,
      }),
    });
  } catch (error) {
    console.error("No se pudo hablar con Brevo para el alta:", error);
    return { estado: "error", pista: "No se pudo contactar con el proveedor de correo." };
  }

  if (respuesta.ok) return { estado: "alta" };

  // Del cuerpo del error solo salen estos dos campos, y recortados: son
  // descripciones cortas del proveedor. Volcar la respuesta entera es lo
  // que acaba escupiendo una credencial en un registro.
  let code = "";
  let message = "";
  try {
    const cuerpo: unknown = await respuesta.json();
    if (cuerpo && typeof cuerpo === "object") {
      const o = cuerpo as Record<string, unknown>;
      if (typeof o["code"] === "string") code = o["code"].slice(0, 60);
      if (typeof o["message"] === "string") message = o["message"].slice(0, 200);
    }
  } catch {
    // Una respuesta que no es JSON no aporta nada: queda el código HTTP.
  }

  const pista = queHacer(respuesta.status, code, message);
  const detalle = [code, message].filter(Boolean).join(": ");
  console.error(
    `No salió el alta en el boletín: Brevo respondió ${respuesta.status}` +
      `${detalle ? ` (${detalle})` : ""}. ${pista}`,
  );
  return { estado: "error", pista: `Brevo respondió ${respuesta.status}. ${pista}` };
}
