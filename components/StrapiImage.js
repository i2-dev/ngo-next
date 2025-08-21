import Image from "next/image";
import { getStrapiMedia } from "@/utils/get-strapi-media";

const StrapiImage = ({
  image,
  className,
  width,
  height,
  format,
  alt,
  priority = false,
  loading = "lazy",
}) => {
  const imageUrl = getStrapiMedia(image, format);

  if (!imageUrl) {
    return null;
  }

  const altText = alt || image.data?.attributes?.alternativeText || "Image";

  return (
    <Image
      src={imageUrl}
      width={width || image.data?.attributes?.width || 1000}
      height={height || image.data?.attributes?.height || 1000}
      className={className}
      alt={altText}
      priority={priority}
      loading={priority ? "eager" : loading}
    />
  );
};

export default StrapiImage;
