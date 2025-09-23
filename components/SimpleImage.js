import { getStrapiMedia } from "@/utils/get-strapi-media";

const SimpleImage = ({
  image,
  className = "",
  alt,
  loading = "lazy",
  ...props
}) => {
  const imageUrl = getStrapiMedia(image);

  if (!imageUrl) {
    return null;
  }

  const altText = alt || image?.data?.attributes?.alternativeText || "Image";

  return (
    <img
      src={imageUrl}
      className={className}
      alt={altText}
      loading={loading}
      {...props}
    />
  );
};

export default SimpleImage;
