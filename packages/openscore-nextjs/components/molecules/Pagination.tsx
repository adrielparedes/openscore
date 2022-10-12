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
        <li className="page-item">
          <a className="page-link" href="#">
            Previous
          </a>
        </li>
        {Array.from(Array(pages).keys()).map((key) => (
          <li className="page-item" key={key}>
            <a className="page-link" onClick={() => setPage(key)}>
              {key + 1}
            </a>
          </li>
        ))}
        <li className="page-item">
          <a className="page-link" href="#">
            Next
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
