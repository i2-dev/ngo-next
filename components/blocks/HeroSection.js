// 基础 HeroSection 组件模板
export default function HeroSection({ title, description, image, button }) {
  return (
    <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        {title && (
          <h1 className="text-5xl font-bold mb-6">
            {title}
          </h1>
        )}
        {description && (
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {description}
          </p>
        )}
        {button && (
          <a
            href={button.url}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            {button.text}
          </a>
        )}
      </div>
    </section>
  );
}