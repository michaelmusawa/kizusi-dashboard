const Loading = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 animate-pulse">
        {/* Booking Details Skeleton */}
        <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>

        {/* Divider */}
        <div className="w-full border-t border-gray-300 my-6"></div>

        {/* User & Car Section */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* User Information Skeleton */}
          <div className="flex-1 p-4 relative rounded-2xl shadow-lg bg-gray-200">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gray-300 rounded-full"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-300 rounded w-32"></div>
                <div className="h-4 bg-gray-300 rounded w-40"></div>
                <div className="h-4 bg-gray-300 rounded w-36"></div>
              </div>
            </div>
          </div>

          {/* Car Information Skeleton */}
          <div className="flex-1 rounded-2xl shadow-lg bg-gray-200 overflow-hidden">
            <div className="w-full h-52 bg-gray-300"></div>
            <div className="p-4 text-center">
              <div className="h-6 bg-gray-300 rounded w-1/3 mx-auto"></div>
              <div className="h-4 bg-gray-300 rounded w-1/4 mx-auto mt-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/3 mx-auto mt-2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Loading;
