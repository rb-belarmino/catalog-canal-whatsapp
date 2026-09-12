export type LogLevel = "info" | "warn" | "error" | "debug";

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  module: string;
  message: string;
  traceId?: string;
  data?: Record<string, unknown>;
}

const SENSITIVE_KEYS = new Set([
  "password",
  "token",
  "secret",
  "authorization",
  "cookie",
  "phonenumber",
  "whatsappnumber",
]);

function sanitize(value: unknown): unknown {
  if (!value || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(sanitize);

  const cleaned: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    if (SENSITIVE_KEYS.has(k.toLowerCase())) {
      cleaned[k] = "[REDACTED]";
    } else if (typeof v === "object" && v !== null) {
      cleaned[k] = sanitize(v);
    } else {
      cleaned[k] = v;
    }
  }
  return cleaned;
}

export function log(
  level: LogLevel,
  module: string,
  message: string,
  data?: Record<string, unknown>,
  traceId?: string
): void {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    module,
    message,
    ...(traceId ? { traceId } : {}),
    ...(data ? { data: sanitize(data) as Record<string, unknown> } : {}),
  };

  const line = JSON.stringify(entry);
  if (level === "error") {
    console.error(line);
  } else if (level === "warn") {
    console.warn(line);
  } else {
    console.log(line);
  }
}

export const logger = {
  info: (module: string, message: string, data?: Record<string, unknown>, traceId?: string) =>
    log("info", module, message, data, traceId),
  warn: (module: string, message: string, data?: Record<string, unknown>, traceId?: string) =>
    log("warn", module, message, data, traceId),
  error: (module: string, message: string, data?: Record<string, unknown>, traceId?: string) =>
    log("error", module, message, data, traceId),
  debug: (module: string, message: string, data?: Record<string, unknown>, traceId?: string) =>
    log("debug", module, message, data, traceId),
};
