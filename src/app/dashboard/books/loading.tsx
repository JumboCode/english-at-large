/**
 * Loading skeleton that renders grayed out book info when used with:
 *  1. Suspense (React.use())
 * OR..
 *  2. useState isLoading, etc. (React.useEffect())
 * Note that Suspense cannot be used with useEffect(). 
 * 
 * @returns loading box
 */
export default function LoadingSkeleton() {
  return (
    <div>
      <div className="animate-pulse space-y-2">
      <div className="h-6 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      <div className="h-16 bg-gray-200 rounded"></div>
    </div>
    </div>
  );
}
