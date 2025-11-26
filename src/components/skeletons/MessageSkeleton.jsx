const MessageSkeleton = ({ count = 5 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0 animate-pulse-fast" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <div className="h-5 bg-gray-200 rounded w-32 animate-pulse-fast" />
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse-fast" />
              </div>
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse-fast" />
              <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse-fast" />
              <div className="h-3 bg-gray-200 rounded w-24 animate-pulse-fast" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageSkeleton;

