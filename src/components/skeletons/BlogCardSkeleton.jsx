const BlogCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm">
      <div className="relative overflow-hidden bg-gray-200 aspect-video animate-pulse-fast" />
      <div className="p-6">
        <div className="h-6 bg-gray-200 rounded mb-3 animate-pulse-fast" />
        <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse-fast" />
        <div className="h-4 bg-gray-200 rounded mb-2 w-3/4 animate-pulse-fast" />
        <div className="h-4 bg-gray-200 rounded mb-4 w-1/2 animate-pulse-fast" />
        <div className="flex items-center justify-between">
          <div className="h-3 bg-gray-200 rounded w-24 animate-pulse-fast" />
          <div className="h-3 bg-gray-200 rounded w-16 animate-pulse-fast" />
        </div>
      </div>
    </div>
  );
};

export default BlogCardSkeleton;

