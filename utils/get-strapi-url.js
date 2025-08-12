export function getStrapiURL(path = "") {
  return `${process.env.NEXT_PUBLIC_STRAPI_URL || "http://strapi2-dev.dev.i2hk.net"}${path}`;
}