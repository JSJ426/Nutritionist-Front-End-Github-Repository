type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages < 1) {
    return null;
  }

  const maxVisiblePages = 7;
  const siblingCount = 2;

  const renderPageButton = (page: number) => (
    <button
      key={page}
      className={`px-3 py-1 border rounded ${
        currentPage === page ? 'bg-[#5dccb4] text-white border-[#5dccb4]' : 'hover:bg-gray-50'
      }`}
      onClick={() => onPageChange(page)}
    >
      {page}
    </button>
  );

  const pages: React.ReactNode[] = [];

  if (totalPages <= maxVisiblePages) {
    for (let page = 1; page <= totalPages; page += 1) {
      pages.push(renderPageButton(page));
    }
  } else {
    const startPage = Math.max(2, currentPage - siblingCount);
    const endPage = Math.min(totalPages - 1, currentPage + siblingCount);

    pages.push(renderPageButton(1));

    if (startPage > 2) {
      pages.push(
        <span key="start-ellipsis" className="px-2 text-gray-500">
          ...
        </span>
      );
    }

    for (let page = startPage; page <= endPage; page += 1) {
      pages.push(renderPageButton(page));
    }

    if (endPage < totalPages - 1) {
      pages.push(
        <span key="end-ellipsis" className="px-2 text-gray-500">
          ...
        </span>
      );
    }

    pages.push(renderPageButton(totalPages));
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
      {pages}
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
