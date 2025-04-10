export default function LoadingSkeleton() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-dark-blue border-t-transparent"></div>
      </div>
    </div>
  );
}
