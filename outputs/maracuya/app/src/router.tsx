import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { createHashHistory } from "@tanstack/history";
import { routeTree } from "./routeTree.gen";

/**
 * La compilación estática de vista previa se publica bajo una ruta que no
 * controlamos, así que `pushState` sacaría al visitante fuera del sitio. En
 * ese modo, y solo en ese, el router navega por `#`. La app normal conserva
 * sus URLs limpias.
 */
const enrutadoPorHash = import.meta.env["VITE_HASH_ROUTER"] === "1";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    ...(enrutadoPorHash && typeof document !== "undefined" ? { history: createHashHistory() } : {}),
  });

  return router;
};
