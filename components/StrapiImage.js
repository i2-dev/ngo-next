import Image from 'next/image';
import { getStrapiMedia } from "@/utils/get-strapi-media";

const StrapiImage = ({
  image,
  className = "",
  alt,
  width,
  height,
  priority = false,
  style,
  ...props
}) => {
  const imageUrl = getStrapiMedia(image);

  if (!imageUrl) {
    return null;
  }

  const altText = alt || image?.data?.attributes?.alternativeText || "Image";

  // 如果沒有提供 width 和 height，嘗試從 image 數據中獲取
  const imageWidth = width || image?.data?.attributes?.width;
  const imageHeight = height || image?.data?.attributes?.height;

  // 如果沒有明確的尺寸，使用 Next.js Image 的 fill 模式
  if (!imageWidth || !imageHeight) {
    return (
      <div className={`relative ${className}`} style={style}>
        <Image
          src={imageUrl}
          alt={altText}
          fill
          priority={priority}
          className="object-cover"
          {...props}
        />
      </div>
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={altText}
      width={imageWidth}
      height={imageHeight}
      className={className}
      style={style}
      priority={priority}
      {...props}
    />
  );
};

export default StrapiImage;
