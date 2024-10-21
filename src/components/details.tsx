const BookDetail = ({ label, value }: { label: string, value: string }) => {
        return (
          <div className="flex row-span-2 my-5">
            <div className="relative text-gray-500 mr-4">{label}</div>
            <div className="relative">{value}</div>
          </div>
        );
      };

export default BookDetail;
      