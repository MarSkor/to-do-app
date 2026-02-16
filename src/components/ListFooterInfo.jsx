const ListFooterInfo = ({
  data,
  filter,
  clearCompleted,
  handleFilterChange,
}) => {
  return (
    <section className="todo__grid-container">
      <section className="box grid-item-1">
        <span className="todo__info-label">
          {data?.totalItems || 0} items left
        </span>
      </section>
      <section className="box grid-item-2">
        <div className="todo__info-categories">
          <button
            className={`todo__info-btn ${filter === "all" ? "active-tab" : ""}`}
            onClick={() => handleFilterChange("all")}
          >
            All
          </button>
          <button
            className={`todo__info-btn ${filter === "active" ? "active-tab" : ""}`}
            onClick={() => handleFilterChange("active")}
          >
            Active
          </button>
          <button
            className={`todo__info-btn ${filter === "completed" ? "active-tab" : ""}`}
            onClick={() => handleFilterChange("completed")}
          >
            Completed
          </button>
        </div>
      </section>
      <section className="box grid-item-3">
        <button onClick={clearCompleted} className="todo__info-btn">
          Clear Completed
        </button>
      </section>
    </section>
  );
};

export default ListFooterInfo;
