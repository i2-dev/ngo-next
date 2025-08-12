import StrapiImage from '@/components/StrapiImage';

export default function Card({ Title, Content, icon, Button }) {
  return (
    <div className="card-block bg-gradient-to-r from-blue-50 to-indigo-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Icon */}
          {icon && (
            <div className="mb-6 flex justify-center">
              <StrapiImage
                image={icon}
                alt={icon.alternativeText || "Card Icon"}
                className="w-20 h-20 md:w-24 md:h-24"
                width={96}
                height={96}
              />
            </div>
          )}
          
          {/* Title */}
          {Title && (
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
              {Title}
            </h2>
          )}
          
          {/* Content */}
          {Content && (
            <div 
              className="text-lg md:text-xl text-gray-700 mb-8 prose prose-lg mx-auto"
              dangerouslySetInnerHTML={{ __html: Content }}
            />
          )}
          
          {/* Button */}
          {Button && Button.Text && Button.URL && (
            <a
              href={Button.URL}
              target={Button.Target || "_self"}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg transition-colors duration-300 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {Button.Text}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}