"use client";

import { createContext, useContext, useMemo, useState } from "react";

type CanvasFxValue = {
  /** Os efeitos devem rodar? */
  enabled: boolean;
  /** Desliga tudo, pra conferir como a pagina fica sem efeito nenhum. */
  forcedOff: boolean;
  setForcedOff: (value: boolean) => void;
};

const CanvasFxContext = createContext<CanvasFxValue | null>(null);

export function CanvasFxProvider({ children }: { children: React.ReactNode }) {
  const [forcedOff, setForcedOff] = useState(false);

  const value = useMemo<CanvasFxValue>(
    () => ({ enabled: !forcedOff, forcedOff, setForcedOff }),
    [forcedOff],
  );

  return (
    <CanvasFxContext.Provider value={value}>
      {children}
    </CanvasFxContext.Provider>
  );
}

/**
 * Fora de um provider os efeitos simplesmente ficam ligados, pra que um
 * componente de fx possa ser usado solto numa pagina qualquer.
 */
export function useCanvasFx(): CanvasFxValue {
  return (
    useContext(CanvasFxContext) ?? {
      enabled: true,
      forcedOff: false,
      setForcedOff: () => {},
    }
  );
}
