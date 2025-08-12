import StrapiImage from "@/components/StrapiImage";

export default function FullImage(block) {
  const { image } = block;
  return (
    <div className="mb-8">
      <StrapiImage
        className="w-full"
        image={image}
        alt={image.alternativeText}
        width={1000}
        height={800}
        priority
      />
    </div>
  );
}
