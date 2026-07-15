import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.vetsai.vet";

  const publicRoutes = [
    "",
    "/pricing",
    "/privacy",
    "/terms",
    "/login",
    "/signup",
    "/demo",
    "/ghana",
    "/nigeria",
    "/kenya",
    "/cameroon",
    "/senegal",
    "/cote-divoire",
    "/burkina-faso",
    "/fr",
    "/fr/login",
    "/fr/signup",
  ];

  return publicRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.7,
  }));
}
