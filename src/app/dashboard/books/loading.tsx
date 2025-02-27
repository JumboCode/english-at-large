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
    <div className="p-1">
      <div className="animate-pulse flex flex-row space-x-8 justify-left">
        <div className="h-[35vh] bg-[#EBEAE7] rounded-xl w-1/3"></div>
        <div className="flex flex-col w-2/5 justify-center">
          <div className="h-12 bg-[#EBEAE7] rounded-xl w-full mb-6"></div>
          <div className="flex flex-row w-full space-x-2">
            <div className="h-5 bg-[#EBEAE7] rounded-xl w-2/5 mb-2"></div>
            <div className="h-5 bg-[#EBEAE7] rounded-xl w-2/5 mb-2"></div>
          </div>
          <div className="h-5 bg-[#EBEAE7] rounded-xl w-2/5 mb-2"></div>
        </div>
      </div>
    </div>
  );
}
