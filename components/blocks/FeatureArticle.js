import StrapiImage from "@/components/StrapiImage";
import CtaButton from "@/components/CtaButton";

export default function FeatureArticle({ title, description, image, button, link, locale }) {
  if (!title && !description && !image && !button && !link) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            {title && (
              <h2 className="text-3xl font-bold text-gray-900">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-lg text-gray-600">
                {description}
              </p>
            )}
            {(button || link) && (
              <div className="pt-4">
                <CtaButton 
                  button={button} 
                  link={link} 
                  locale={locale}
                />
              </div>
            )}
          </div>
          {image && (
            <div className="order-first md:order-last">
              <StrapiImage 
                image={image} 
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}