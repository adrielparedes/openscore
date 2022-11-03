import FilteredPage from "../components/molecules/FilteredPage";
import { layout } from "../components/templates/MainLayout";
import { NextPageWithLayout } from "./_app";

const Test: NextPageWithLayout = () => {
  return (
    <>
      <h1>Test Page</h1>
      <FilteredPage
        link="/test"
        filters={[
          { code: "general", name: "General" },
          { code: "first", name: "General" },
          { code: "second", name: "General" },
          { code: "third", name: "General" },
        ]}
        onSelect={(selected) => {
          console.log(selected);
        }}
      >
        <div>Hello</div>
      </FilteredPage>
    </>
  );
};

Test.getLayout = layout;

export default Test;
