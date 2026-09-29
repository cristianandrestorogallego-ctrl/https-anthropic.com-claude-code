import { useMemo, useState } from "react";
import { AlertTriangle, Info } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  codigoPorMunicipio,
  coberturaPermiteEnviar,
  comprobarCobertura,
  municipioPorCodigo,
  municipiosServidos,
  type Cobertura,
} from "@/lib/tartas";

/**
 * ¿Dónde lo llevamos?
 *
 * Vive aparte porque lo preguntan dos formularios —tartas y congelados— y
 * es el mismo reparto: los mismos municipios, los mismos avisos y el mismo
 * "no" a tiempo. Si mañana cambia la zona de servicio, cambia aquí y
 * cambia en los dos; duplicado, habría cambiado en uno y el otro seguiría
 * prometiendo entregas donde ya no llegamos.
 *
 * Lo único que cambia entre formularios es qué se deja de poder llevar
 * fuera de zona, y eso entra por `fuera`.
 */

/** La clase de los campos, igual que en el resto de formularios. */
export const CAMPO =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground transition-[border-color,box-shadow] duration-200 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25";

export type Zona = {
  cp: string;
  municipio: string;
  tocadoCp: boolean;
  setTocadoCp: (v: boolean) => void;
  escribirCp: (valor: string) => void;
  elegirMunicipio: (valor: string) => void;
  cobertura: Cobertura;
  fueraDeProvincia: boolean;
  puedeEnviar: boolean;
};

export function useZona(): Zona {
  const [municipio, setMunicipio] = useState("");
  const [cp, setCp] = useState("");
  const [tocadoCp, setTocadoCp] = useState(false);

  /** Escribir el código elige el municipio, si ese código solo es de uno. */
  const escribirCp = (valor: string) => {
    const limpio = valor.replace(/\D/g, "");
    setCp(limpio);
    if (limpio.length === 5) {
      const encontrado = municipioPorCodigo(limpio);
      if (encontrado) setMunicipio(encontrado);
    }
  };

  /** Y elegir el municipio rellena el código, si el municipio solo tiene uno. */
  const elegirMunicipio = (valor: string) => {
    setMunicipio(valor);
    const unico = codigoPorMunicipio(valor);
    if (unico) setCp(unico);
  };

  const cobertura = useMemo(() => comprobarCobertura(cp, municipio), [cp, municipio]);
  const fueraDeProvincia = /^\d{5}$/.test(cp) && !cp.startsWith("08");

  return {
    cp,
    municipio,
    tocadoCp,
    setTocadoCp,
    escribirCp,
    elegirMunicipio,
    cobertura,
    fueraDeProvincia,
    puedeEnviar: coberturaPermiteEnviar(cobertura),
  };
}

export function CamposZona({ z, fuera }: { z: Zona; fuera: string }) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="cp">
            Código postal <span className="text-destructive">*</span>
          </Label>
          <Input
            id="cp"
            required
            inputMode="numeric"
            maxLength={5}
            placeholder="08001"
            value={z.cp}
            onChange={(e) => z.escribirCp(e.target.value)}
            onBlur={() => z.setTocadoCp(true)}
            aria-invalid={z.fueraDeProvincia || undefined}
            aria-describedby={z.fueraDeProvincia ? "cp-aviso" : undefined}
          />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="municipio">
            Municipio <span className="text-destructive">*</span>
          </Label>
          <select
            id="municipio"
            required
            className={CAMPO}
            value={z.municipio}
            onChange={(e) => z.elegirMunicipio(e.target.value)}
          >
            <option value="">Elige tu municipio</option>
            {municipiosServidos.map((m) => (
              <option key={m.nombre} value={m.nombre}>
                {m.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {z.fueraDeProvincia && (
        <p
          id="cp-aviso"
          role="alert"
          className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm leading-relaxed text-destructive"
        >
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>{fuera}</span>
        </p>
      )}

      {z.cobertura.estado === "desajuste" && (
        <p className="flex items-start gap-2 rounded-lg bg-secondary p-3 text-sm leading-relaxed text-secondary-foreground">
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>
            Ese código postal no nos consta en {z.cobertura.municipio}. Puedes seguir: lo
            comprobamos al preparar la respuesta.
          </span>
        </p>
      )}

      {z.tocadoCp && z.cp === "" && (
        <p role="alert" className="text-sm text-destructive">
          El código postal es obligatorio para continuar.
        </p>
      )}
    </>
  );
}
