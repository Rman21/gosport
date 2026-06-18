export const siteOrigin = process.env.NEXT_PUBLIC_SPORTIL_SITE_URL ?? "https://gosport.co.il";

export function absoluteUrl(path = "/") {
  return new URL(path, siteOrigin).toString();
}
