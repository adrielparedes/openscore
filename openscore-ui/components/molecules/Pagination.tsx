export interface PaginationProps {
  page: number;
  setPage: (p: number) => void;
  pageSize: number;
  count: number;
}

const Pagination = ({ page, setPage, pageSize, count }: PaginationProps) => {
  const pages = Math.ceil(count / pageSize);
  return (
    <nav aria-label="Page navigation example">
      <ul className="pagination">
        <li className={`page-item ${page === 0 ? "disabled" : ""}`}>
          <a
            className="page-link"
            onClick={() => {
              if (page > 0) setPage(page - 1);
            }}
          >
            Previous
          </a>
        </li>
        {Array.from(Array(pages).keys()).map((key) => (
          <li className={`page-item ${page === key ? "active" : ""}`} key={key}>
            <a className="page-link" onClick={() => setPage(key)}>
              {key + 1}
            </a>
          </li>
        ))}
        <li className={`page-item ${page === pages - 1 ? "disabled" : ""}`}>
          <a
            className="page-link"
            onClick={() => {
              if (page < pages - 1) setPage(page + 1);
            }}
          >
            Next
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
