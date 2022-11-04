import Link from "next/link";
import { useRouter } from "next/router";
import { PropsWithChildren, useEffect, useState } from "react";
import { SetterOrUpdater } from "recoil";
import { useWindowDimensions } from "../../hooks/Hooks";
import LoadingScreen from "./LoadingScreen";

export interface Filter {
  code: string;
  name: string;
  default?: boolean;
}

export const NONE: Filter = {
  code: "none",
  name: "NONE",
};

export interface FilteredPageProps extends PropsWithChildren {
  filters: Filter[];
  link: string;
  select: SetterOrUpdater<Filter>;
}

const SelectDropdown = () => {};

const FilteredPage = ({
  children,
  filters,
  link,
  select,
}: FilteredPageProps) => {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [fs, setFs] = useState<Filter[]>([]);

  useEffect(() => {
    if (filters.length > 0) {
      const def = filters[0];
      setFs([...filters]);

      const code = router.query["filter"] as string;

      if (router.isReady) {
        if (!router.asPath.includes("filter")) {
          router.push(`${link}?filter=${def.code}`);
          return;
        }

        setQuery(code);
        const found = filters.find((f) => f.code === code);

        if (found) {
          select(found);
        } else {
          select(filters[0]);
        }
      }
    }
  }, [router, filters]);

  if (width > 1024) {
    return (
      <div className="filtered">
        <div className="filtered__filters">
          <ul className="nav flex-column nav-pills">
            {fs.map((f) => (
              <li key={f.code} className="nav-item">
                <Link href={`${link}?filter=${f.code}`}>
                  <a
                    className={`nav-link ${query === f.code ? "active" : ""}`}
                    aria-current="page"
                    href="#"
                    onClick={() => select(f)}
                  >
                    {f.name}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="filtered__content container">
          <LoadingScreen busy={fs.length < 1}>{children}</LoadingScreen>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <select
          className="form-select mb-3"
          aria-label="Default select example"
          onChange={(ev) => {
            select(fs.find((f) => f.code === ev.target.value) || NONE);
            router.push(`${link}?filter=${ev.target.value}`);
          }}
          value={router.query["filter"]}
        >
          {fs.map((f) => (
            <option key={f.code} value={f.code}>
              {f.name}
            </option>
          ))}
        </select>
        {children}
      </div>
    );
  }
};

export default FilteredPage;
