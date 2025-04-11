"use client";
import {
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

type PaginationButtonProps = {
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
};

const PaginationButton = ({
  disabled = false,
  onClick,
  children,
}: PaginationButtonProps) => {
  return (
    <button
      className={`${
        !disabled ? "pagination-button" : "pagination-button disabled"
      }`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

function PaginationControls({
  pagination,
}: {
  pagination: {
    total: number;
    hasMore: boolean;
    hasPrevious: boolean;
    currentPage: number;
    limit: number;
  };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { total, currentPage, limit } = pagination;
  const totalPages = Math.ceil(total / limit);

  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, currentPage + 2);

  if (currentPage <= 3) {
    endPage = Math.min(5, totalPages);
  } else if (currentPage >= totalPages - 2) {
    startPage = Math.max(totalPages - 4, 1);
  }

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const onPageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex gap-2 items-center mt-3">
      <PaginationButton
        disabled={currentPage === 1}
        onClick={() => onPageChange(1)}
      >
        <FaAngleDoubleLeft />
      </PaginationButton>

      <PaginationButton
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <FaAngleLeft />
      </PaginationButton>

      {startPage > 1 && (
        <>
          <PaginationButton onClick={() => onPageChange(1)}>1</PaginationButton>
          {startPage > 2 && <span className="px-2">...</span>}
        </>
      )}

      {pageNumbers.map((pageNum) => (
        <PaginationButton
          key={pageNum}
          disabled={pageNum === currentPage}
          onClick={() => onPageChange(pageNum)}
        >
          {pageNum}
        </PaginationButton>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2">...</span>}
          <PaginationButton onClick={() => onPageChange(totalPages)}>
            {totalPages}
          </PaginationButton>
        </>
      )}

      <PaginationButton
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <FaAngleRight />
      </PaginationButton>

      <PaginationButton
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(totalPages)}
      >
        <FaAngleDoubleRight />
      </PaginationButton>
    </div>
  );
}

export default PaginationControls;
