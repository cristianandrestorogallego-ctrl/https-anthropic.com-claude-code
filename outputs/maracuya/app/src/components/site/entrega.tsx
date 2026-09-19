import { useState } from "react";
import { MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * Códigos postales a los que NO se envía, por sus dos primeras cifras.
 * Sin esto el estimador le prometía a alguien de Las Palmas una entrega en
 * 48 horas que nadie iba a cumplir.
 */
const FUERA_DE_ZONA: Record<string, string> = {
  "07": "Baleares",
  "35": "Las Palmas",
  "38": "Santa Cruz de Tenerife",
  "51": "Ceuta",
  "52": "Melilla",
};

/**
 * Estimación de entrega de DEMOSTRACIÓN.
 * Regla provisional: 1-2 días laborables de reparto, sin domingos.
 * No es una condición comercial confirmada; se configurará en Shopify.
 */
function estimar(dias: number) {
  const fecha = new Date();
  let sumados = 0;
  while (sumados < dias) {
    fecha.setDate(fecha.getDate() + 1);
    if (fecha.getDay() !== 0) sumados++;
  }
  return fecha.toLocaleDateString("es-ES", { day: "numeric", month: "long" });
}

export function EstimadorEntrega({ compacto = false }: { compacto?: boolean }) {
  const [cp, setCp] = useState("");
  const [resultado, setResultado] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calcular = () => {
    if (!/^\d{5}$/.test(cp)) {
      setResultado(null);
      setError("Introduce un código postal español de 5 cifras.");
      return;
    }
    const provincia = FUERA_DE_ZONA[cp.slice(0, 2)];
    if (provincia) {
      setResultado(null);
      setError(`Todavía no enviamos a ${provincia}. Por ahora solo España peninsular.`);
      return;
    }
    setError(null);
    setResultado(`Entre el ${estimar(1)} y el ${estimar(2)}`);
  };

  return (
    <div className={compacto ? "space-y-2" : "rounded-2xl border bg-card p-4 space-y-2"}>
      <label htmlFor={`cp-${compacto}`} className="flex items-center gap-2 text-sm font-medium">
        <MapPin className="size-4 text-primary" />
        Introduce tu código postal para estimar la entrega
      </label>
      {/* Un formulario de verdad: en un campo de una línea, Enter tiene que
          calcular. Antes solo respondía al clic en el botón. */}
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          calcular();
        }}
      >
        <Input
          id={`cp-${compacto}`}
          inputMode="numeric"
          maxLength={5}
          placeholder="28001"
          value={cp}
          onChange={(e) => setCp(e.target.value.replace(/\D/g, ""))}
          aria-describedby={error ? `cp-error-${compacto}` : undefined}
          aria-invalid={error ? true : undefined}
          className="max-w-32"
        />
        <Button type="submit" variant="secondary">
          Calcular
        </Button>
      </form>
      {error && (
        <p id={`cp-error-${compacto}`} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
      {resultado && (
        <p className="text-sm" role="status">
          Entrega estimada: <span className="font-medium">{resultado}</span>
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        Estimación de demostración. Los plazos reales se configurarán en Shopify.
      </p>
    </div>
  );
}
