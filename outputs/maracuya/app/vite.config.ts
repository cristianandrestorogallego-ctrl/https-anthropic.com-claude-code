// Configuración propia. Sustituye a @lovable.dev/vite-tanstack-config, que
// además de componer estos plugins traía piezas atadas a Lovable —proxy de
// sus assets, detección de su sandbox, diagnósticos de su build y un preset
// de Cloudflare— que este proyecto ya no usa.
//
// Orden de plugins: tailwind, TanStack Start, nitro (solo en build) y React
// al final. Es el mismo orden que aplicaba el paquete, menos el plugin
// vite-tsconfig-paths, que Vite 8 sustituye por resolve.tsconfigPaths.
import { defineConfig, loadEnv, type PluginOption } from "vite";
import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

const srcDir = fileURLToPath(new URL("./src", import.meta.url));

/**
 * Vista previa estática: una sola página que arranca el router en cliente,
 * con rutas relativas, para poder publicarla como un sitio suelto. Se activa
 * con MARACUYA_PREVIEW=1 y no afecta a la compilación normal.
 */
const vistaPrevia = process.env["MARACUYA_PREVIEW"] === "1";

export default defineConfig(async ({ command, mode }) => {
  const plugins: PluginOption[] = [
    tailwindcss(),
    tanstackStart({
      // Evita que un módulo de servidor acabe en el bundle del cliente.
      importProtection: {
        behavior: "error",
        client: { files: ["**/server/**"], specifiers: ["server-only"] },
      },
      ...(vistaPrevia
        ? {
            spa: {
              enabled: true,
              maskPath: "/",
              prerender: {
                enabled: true,
                outputPath: "/index.html",
                crawlLinks: false,
                retryCount: 0,
              },
            },
          }
        : {}),
    }),
  ];

  // nitro empaqueta el servidor SSR. Sin preset explícito construye para
  // Node, que es lo portable; el host se decide al desplegar.
  if (command === "build" && !vistaPrevia) {
    const { nitro } = await import("nitro/vite");
    plugins.push(nitro());
  }

  plugins.push(viteReact());

  // Reexpone las VITE_* como import.meta.env.VITE_* también en SSR.
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const define = Object.fromEntries(
    Object.entries(env).map(([key, value]) => [`import.meta.env.${key}`, JSON.stringify(value)]),
  );

  return {
    // Bajo una ruta ajena las URL absolutas de los assets no resuelven.
    base: vistaPrevia ? "./" : "/",
    define,
    plugins,
    resolve: {
      // Vite 8 resolve los paths de tsconfig de forma nativa; el alias
      // explícito cubre los sitios que no pasan por TypeScript.
      tsconfigPaths: true,
      alias: { "@": srcDir },
      // Una sola copia de React y del router en el grafo, o los hooks y el
      // contexto del carrito se rompen con instancias duplicadas.
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-dom/client",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
      ],
    },
  };
});
