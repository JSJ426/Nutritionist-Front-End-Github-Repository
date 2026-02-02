type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages < 1) {
    return null;
  }

  return (
    <div className="mt-6 flex justify-center items-center gap-2">
      <button
        className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        이전
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          className={`px-3 py-1 border rounded ${
            currentPage === page ? 'bg-[#5dccb4] text-white border-[#5dccb4]' : 'hover:bg-gray-50'
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      <button
        className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        다음
      </button>
    </div>
  );
}
