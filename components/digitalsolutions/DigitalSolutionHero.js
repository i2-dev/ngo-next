import StrapiImage from "@/components/StrapiImage";

export default function DigitalSolutionHero({ plan, locale }) {
  if (!plan) return null;

  return (
    <div className="relative bg-gradient-to-br from-green-600 to-blue-600 text-white py-20">
      {/* 背景圖片 */}
      {plan.image && (
        <div className="absolute inset-0">
          <StrapiImage
            image={plan.image}
            alt={plan.title}
            className="w-full h-full object-cover opacity-20"
          />
        </div>
      )}
      
      {/* 內容 */}
      <div className="relative z-10 xl:container xl:max-w-[1280px] xl:mx-auto px-5">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            {plan.title}
          </h1>
          
          {plan.content && (
            <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
              {plan.content}
            </p>
          )}
          
          {plan.button && (
            <a
              href={plan.button.URL}
              target={plan.button.Target === '_blank' ? '_blank' : '_self'}
              rel={plan.button.Target === '_blank' ? 'noopener noreferrer' : ''}
              className="inline-flex items-center px-8 py-4 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 text-lg"
            >
              {plan.button.Text}
              <svg 
                className="ml-2 w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M14 5l7 7m0 0l-7 7m7-7H3" 
                />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
