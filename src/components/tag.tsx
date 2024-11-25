const Tag = ({ label }: { label: string }) => {
  return (
    <button className="py-2 px-3 border border-[#D4D4D4] mr-3 rounded-full cursor-default text-sm">
      {label}
    </button>
  );
};

export default Tag;
