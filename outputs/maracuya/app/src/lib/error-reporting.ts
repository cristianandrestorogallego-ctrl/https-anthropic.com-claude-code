// Punto único por el que pasan los errores que atrapan los límites de React.
// Hoy solo escribe en consola: no hay servicio de telemetría contratado y no
// se va a inventar uno. Cuando lo haya, se conecta aquí y en ningún otro
// sitio.
export function reportError(error: unknown, context: Record<string, unknown> = {}) {
  const detalle =
    error instanceof Response
      ? `Response ${error.status}${error.url ? ` en ${error.url}` : ""}`
      : error instanceof Error
        ? error.message
        : String(error);

  console.error("[maracuya]", detalle, {
    ...context,
    ...(typeof window !== "undefined" ? { ruta: window.location.pathname } : {}),
    ...(error instanceof Error && error.stack ? { stack: error.stack } : {}),
  });
}
