import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-8">
          <div className="text-6xl text-gray-300 mb-4">📂</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            分類不存在
          </h1>
          <p className="text-gray-600 mb-8">
            抱歉，您要查看的分類不存在或已被移除。
          </p>
        </div>
        
        <div className="space-y-4">
          <Link 
            href="/ngo-latest-news"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          >
            返回新聞列表
          </Link>
          
          <div className="text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600">
              返回主頁
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
