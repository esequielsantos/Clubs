import type { Endpoint } from "@/endpoints";
import { environment } from "@/env";

export async function apiFetch<TRota extends keyof Endpoint>(
  rota: TRota,
  params: string = "",
  opcoes?: RequestInit,
): Promise<Awaited<Endpoint[TRota]>> {
  const response = await fetch(environment.api + rota + params, {
    credentials: "include",
    ...opcoes,
  });

  if (response.ok) {
    return response.json();
  }

  await response.json().then(
    json => console.error(json),
    async () => console.error(await response.text()),
  );

  throw new Error(`Erro na rota ${rota}: ${response.statusText}`);
}
