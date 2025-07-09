import ProductList from "./ProductList";
import Sorting from "../../components/Sorting";
import { useFetchFiltersQuery, useFetchProductsQuery } from "./catalogApi";
import Filters from "../../components/Filters";
import { useAppDispatch, useAppSelector } from "../../app/store/store";
import { setOrderBy, setPageNumber } from "./catalogSlice";
import AppPagination from "../../components/AppPagination";

const sortOptions = [
  { value: "name", label: "Alphabetical A-Z" },
  { value: "pricedesc", label: "Price: High to Low" },
  { value: "price", label: "Price: Low to High" },
];

export default function Catalog() {
  const productParams = useAppSelector((state) => state.catalog); // Full params
  const selectedSort = useAppSelector((state) => state.catalog.orderBy); // Just orderBy
  const { data: filtersData } = useFetchFiltersQuery();
  const { data: products, isLoading } = useFetchProductsQuery(productParams);
  const dispatch = useAppDispatch();

  if (isLoading || !filtersData)
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-gray-600 text-sm sm:text-base">
        Loading Catalog Page...
      </div>
    );

  return (
    <section className="py-15 sm:py-6">
      <div className="container mx-auto flex flex-wrap justify-between items-center gap-4 mb-6 px-4 sm:px-6 md:px-10">
        <Sorting
          options={sortOptions}
          selectedValue={selectedSort}
          onChange={(e) => dispatch(setOrderBy(e.target.value))}
        />
      </div>
      {/* Main Content */}
      <div className="container mx-auto flex flex-col lg:flex-row gap-8 px-4 sm:px-6 md:px-10">
        {/* Sidebar Filters */}
        <aside className="w-1/6 space-y-6">
          <Filters />
        </aside>
        <div className="w-full">
          {products.items && products.items.length > 0 ? (
            <>
              <ProductList products={products.items} />
              <AppPagination
                metadata={products.pagination}
                onPageChange={(page: number) => {
                  dispatch(setPageNumber(page));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </>
          ) : (
            <div className="flex justify-center items-center min-h-[60vh] text-gray-600 text-sm sm:text-base">
              There are no results for this filter
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
