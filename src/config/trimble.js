// Single source of truth for your Trimble key (same as your live demo)
export const TRIMBLE_API_KEY =
  (import.meta?.env && import.meta.env.VITE_TRIMBLE_API_KEY) ||
  "E3D28D4387DBD94E9DE9FA6C43841A62";
