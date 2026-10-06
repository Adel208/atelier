import type { NextConfig } from "next";

// STATIC_EXPORT=1 : génère un site statique (dossier "out") pour Netlify.
// Sans cette variable, le mode de développement habituel (Vinext) n'est pas modifié.
const nextConfig: NextConfig = process.env.STATIC_EXPORT
  ? { output: "export", images: { unoptimized: true }, trailingSlash: false }
  : {};

export default nextConfig;
