/**
 * Empaqueta la vista previa estática.
 *
 * `base: "./"` de Vite no llega a las etiquetas que inyecta el manifiesto de
 * TanStack Start: salen como `/./assets/…`, con barra inicial, y bajo una
 * ruta que no es la raíz del dominio eso es un 404. Este paso reescribe esas
 * referencias a rutas relativas, en el HTML y en los fragmentos de JS que
 * las llevan dentro.
 */
import { readdir, readFile, writeFile, rm, stat } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = fileURLToPath(new URL("../dist/client/", import.meta.url));

async function archivos(dir) {
  const salida = [];
  for (const entrada of await readdir(dir, { withFileTypes: true })) {
    const ruta = join(dir, entrada.name);
    if (entrada.isDirectory()) salida.push(...(await archivos(ruta)));
    else salida.push(ruta);
  }
  return salida;
}

const REEMPLAZOS = [
  [/(["'(])\/\.\/assets\//g, "$1./assets/"],
  [/(["'(])\/assets\//g, "$1./assets/"],
  [/(["'(])\/favicon\.png/g, "$1./favicon.png"],
];

let tocados = 0;
for (const ruta of await archivos(RAIZ)) {
  if (!/\.(html|js|css)$/.test(ruta)) continue;
  const antes = await readFile(ruta, "utf8");
  let despues = antes;
  for (const [patron, sustituto] of REEMPLAZOS) despues = despues.replace(patron, sustituto);
  if (despues !== antes) {
    await writeFile(ruta, despues);
    tocados += 1;
  }
}

// El bundle de servidor no se publica.
await rm(fileURLToPath(new URL("../dist/server/", import.meta.url)), {
  recursive: true,
  force: true,
});

const todos = await archivos(RAIZ);
let bytes = 0;
for (const f of todos) bytes += (await stat(f)).size;
console.log(
  `vista previa lista: ${todos.length} archivos, ${(bytes / 1024 / 1024).toFixed(2)} MB` +
    ` · ${tocados} con rutas reescritas`,
);
