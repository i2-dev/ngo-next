import { getStrapiURL } from "@/utils/get-strapi-url";

export function getStrapiMedia(image, format = "") {
  if (!image) {
    return null;
  }

  if (image.data && image.data.attributes) {
    const { url, formats } = image.data.attributes;

    if (format && formats && formats[format]) {
      return getStrapiURL(formats[format].url);
    }

    return getStrapiURL(url);
  }

  if (image.url) {
    return getStrapiURL(image.url);
  }

  if (typeof image === "string") {
    return getStrapiURL(image);
  }

  return null;
}
