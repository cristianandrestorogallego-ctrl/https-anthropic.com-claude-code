import { useState } from "react";
import { MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    setError(null);
    setResultado(`Entre el ${estimar(1)} y el ${estimar(2)}`);
  };

  return (
    <div className={compacto ? "space-y-2" : "rounded-2xl border bg-card p-4 space-y-2"}>
      <label htmlFor={`cp-${compacto}`} className="flex items-center gap-2 text-sm font-medium">
        <MapPin className="size-4 text-primary" />
        Introduce tu código postal para estimar la entrega
      </label>
      <div className="flex gap-2">
        <Input
          id={`cp-${compacto}`}
          inputMode="numeric"
          maxLength={5}
          placeholder="28001"
          value={cp}
          onChange={(e) => setCp(e.target.value.replace(/\D/g, ""))}
          className="max-w-32"
        />
        <Button type="button" variant="secondary" onClick={calcular}>
          Calcular
        </Button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
      {resultado && (
        <p className="text-sm">
          Entrega estimada: <span className="font-medium">{resultado}</span>
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        Estimación de demostración. Los plazos reales se configurarán en Shopify.
      </p>
    </div>
  );
}
