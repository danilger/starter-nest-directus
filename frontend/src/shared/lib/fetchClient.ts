import createClient from "openapi-fetch/dist/index.cjs";
import type { paths } from "../api/api_directus";

export const directusClient = createClient<paths>({
  baseUrl: import.meta.env.VITE_DIRECTUS_API_URL,
  credentials: "include",
});