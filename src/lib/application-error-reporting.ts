export function reportApplicationError(
  error: unknown,
  context: Record<string, unknown> = {},
) {
  const normalized = error instanceof Error
    ? { name: error.name, message: error.message, stack: error.stack }
    : { value: error };

  console.error("[Central Operacional Klabin] Erro da aplicação", {
    error: normalized,
    context,
  });
}
