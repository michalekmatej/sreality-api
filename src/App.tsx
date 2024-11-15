import { ThemeToggler } from "@components/ThemeToggler/ThemeToggler";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { PER_PAGE_OPTIONS, translateAPIField } from "@globals/globals";
import { IJsonTableProps, JsonToTable } from "@components/JsonToTable/JsonToTable";
import { API } from "@globals/api";

const App = () => {
  return (
    <div>
      <div className="flex">
        <h1>Hello world</h1>
        <ThemeToggler />
      </div>

      <Test />

    </div>
  )
}

// interface IEstate {
//   name: string;
//   price: number;
//   type: 1 | 2 | 3;
//   images: string;
// }


export default App;



export const Test = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // -------- fetching data --------
  const { data, isLoading, isError } = useQuery({
    queryKey: ['estates', page, perPage],
    queryFn: () => API.fetchData(page, perPage),
  });

  // -------- extracting estates list from the data --------
  let estates: any[] = data?._embedded?.estates || [];
  let totalResults: number | null = data?.result_size;
  let max_page: number | null = useMemo(() => totalResults && Math.ceil(totalResults / perPage), [totalResults, perPage]);

  const dataToDisplay: IJsonTableProps = {
    rows: estates.map((estate) => {
      return {
        "Název": estate.name,
        "Typ": translateAPIField("category_type_cb", estate.seo.category_type_cb),
        "Kategorie": translateAPIField("category_main_cb", estate.seo.category_main_cb),
        "Typ nemovitosti": translateAPIField("category_sub_cb", estate.seo.category_sub_cb),
        "Lokalita": estate.locality,
        "Cena": estate.price,
        "Fotka": estate._links.images[0].href
      }
    })
  }

  // -------- pre-fetching --------
  const queryClient = useQueryClient();

  useEffect(() => {
    const prefetch = (page: number) => {
      queryClient.prefetchQuery({
        queryKey: ['estates', page, perPage],
        queryFn: () => API.fetchData(page, perPage),
      });
    }

    if (!max_page) return;
    if (page < max_page) prefetch(page + 1);
    if (page > 1) prefetch(page - 1);

  }, [page, max_page, queryClient]);

  // -------- page navigation --------

  const goToPreviousPage = () => {
    if (page <= 1) return;
    setPage(page - 1);
  }

  const goToNextPage = () => {
    if (max_page && page >= max_page) return;
    setPage(page + 1);
  }

  // -------- rendering --------

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading estates</div>;

  return (
    <section>

      <JsonToTable data={dataToDisplay} />
      <TableNavigation
        page={page}
        itemsPerPage={perPage}
        numberOfPages={max_page || 0}
        goToNextPage={goToNextPage}
        goToPreviousPage={goToPreviousPage}
        onChangePageRange={(event) => setPerPage(event.target.value)}
      />

    </section>
  )
}


interface ITableNavigationProps {
  page: number;
  itemsPerPage: number;
  numberOfPages: number;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  onChangePageRange: (event: any) => void;
}

export const TableNavigation = ({ page, itemsPerPage, numberOfPages, goToNextPage, goToPreviousPage, onChangePageRange }: ITableNavigationProps) => {
  return (
    <div className="navigation">
      <button onClick={goToPreviousPage} disabled={page <= 1}>Předchozí</button>
      <span>strana: {page} / {numberOfPages}</span>
      <button onClick={goToNextPage}>Další</button>

      <FormControl>
        <InputLabel id="select-label">Počet výsledků</InputLabel>
        <Select
          labelId="select-label"
          id="select"
          value={itemsPerPage}
          label="Per Page"
          onChange={onChangePageRange}
        >
          {PER_PAGE_OPTIONS.map((option) => (
            <MenuItem key={option} value={option}>{option}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}
