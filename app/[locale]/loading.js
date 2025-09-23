export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex h-screen items-center justify-center bg-gray-100 bg-opacity-90">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
    </div>
  );
}
