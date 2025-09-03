/* ==== DEF BLOCK: PriceMatrix Hook ====================================== */

import { useCallback, useMemo, useState } from "react";
import type { MatrixFileState, PriceMatrixTable } from "../types/pricematrix";
import { parseXlsxToMatrix } from "../lib/pricematrix";

export function usePriceMatrix() {
  const [state, setState] = useState<MatrixFileState>({
    table: null,
    storageOptions: [],
    error: null,
  });

  const reset = useCallback(() => {
    setState({ table: null, storageOptions: [], error: null });
  }, []);

  const loadFile = useCallback(async (file: File) => {
    try {
      const table = await parseXlsxToMatrix(file);
      setState({
        table,
        storageOptions: table.storages,
        error: null,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setState({ table: null, storageOptions: [], error: msg });
    }
  }, []);

  const hasTable = useMemo(() => !!state.table, [state.table]);

  return { state, hasTable, loadFile, reset };
}
