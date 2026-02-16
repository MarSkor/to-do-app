const Pagination = ({ pagination, setPage }) => {
  const { currentPage, totalPages } = pagination;
  if (totalPages <= 1) return null;

  return (
    <div className="todo__pagination">
      <button
        disabled={currentPage === 1}
        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        className="todo__pagination--btn"
      >
        Prev
      </button>

      <span className="todo__pagination--info">
        {currentPage} / {totalPages}
      </span>

      <button
        disabled={currentPage === totalPages}
        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
        className="todo__pagination--btn"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
