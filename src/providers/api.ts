/*
 * Minimal client for Prompify's data proxy, configured at runtime by /env-config.js
 * (window.__PROMPIFY_CONFIG). Only used by ./index.ts.
 */
import type { Identifier } from "ra-core";

type PrompifyConfig = { apiUrl?: string; chatId?: string; token?: string };

declare global {
  interface Window {
    __PROMPIFY_CONFIG?: PrompifyConfig;
  }
}

const config = (): PrompifyConfig => window.__PROMPIFY_CONFIG || {};

export const isConnected = () => Boolean(config().apiUrl && config().chatId);

async function request<T>(table: string, init: RequestInit = {}, query = ""): Promise<T> {
  const cfg = config();
  const res = await fetch(`${cfg.apiUrl}/${cfg.chatId}/${table}${query}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cfg.token ?? ""}`,
      ...(init.headers || {}),
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body?.error || `Request failed (HTTP ${res.status})`);
  }
  return body.data as T;
}

/**
 * Values sent to the database: lists and objects go to jsonb columns as JSON text,
 * `undefined` is dropped. Columns the table does not have are ignored by the proxy.
 */
function toRow(data: Record<string, unknown>) {
  const row: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || key === "id") continue;
    if (value instanceof Date) row[key] = value.toISOString();
    else if (value !== null && typeof value === "object") row[key] = JSON.stringify(value);
    else row[key] = value;
  }
  return row;
}

/** The proxy answers 400 when none of the fields are table columns (e.g. a computed field). */
const ignoreNoColumns = (error: unknown) => {
  if (error instanceof Error && /No valid columns/.test(error.message)) return null;
  throw error;
};

export const prompifyTable = {
  list: (table: string) => request<Record<string, any>[]>(table, {}, "?limit=1000"),
  create: (table: string, data: Record<string, unknown>) =>
    request<Record<string, any>>(table, {
      method: "POST",
      body: JSON.stringify(toRow(data)),
    }),
  update: (table: string, id: Identifier, data: Record<string, unknown>) =>
    request(
      table,
      { method: "PATCH", body: JSON.stringify(toRow(data)) },
      `?id=${encodeURIComponent(String(id))}`,
    ).catch(ignoreNoColumns),
  remove: (table: string, id: Identifier) =>
    request(table, { method: "DELETE" }, `?id=${encodeURIComponent(String(id))}`),
};
