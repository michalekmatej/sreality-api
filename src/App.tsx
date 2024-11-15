import { ThemeToggler } from "@components/ThemeToggler/ThemeToggler";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

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

const PER_PAGE_OPTIONS = [10, 20, 50, 100];

export default App;

const fetchData = async (page: number, perPage: number = 10) => {
  const response = await fetch(`/api/api/cs/v2/estates?per_page=${perPage}&page=${page}`);
  const data = await response.json();
  return data;
};

export const Test = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // handle fetching data
  const { data, isLoading, isError } = useQuery({
    queryKey: ['estates', page, perPage],
    queryFn: () => fetchData(page, perPage),
  });

  // extract estates list from the data
  let estates: any[] = data?._embedded?.estates || [];
  let totalResults: number | null = data?.result_size;
  let max_page: number | null = useMemo(() => totalResults && Math.ceil(totalResults / perPage), [totalResults, perPage]);

  // pre-fetching
  const queryClient = useQueryClient();

  useEffect(() => {
    if (max_page && page < max_page) {
      const nextPage = page + 1;
      queryClient.prefetchQuery({
        queryKey: ['estates', nextPage, perPage],
        queryFn: () => fetchData(nextPage, perPage),
      });
    }
    const prevPage = page - 1;
    if (prevPage > 0) {
      queryClient.prefetchQuery({
        queryKey: ['estates', prevPage, perPage],
        queryFn: () => fetchData(prevPage, perPage),
      });
    }
  }, [page, max_page, queryClient]);


  // page navigation
  const goToPreviousPage = () => {
    if (page <= 1) return;
    setPage(page - 1);
  }

  const goToNextPage = () => {
    if (max_page && page >= max_page) return;
    setPage(page + 1);
  }

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading estates</div>;

  return (
    <section>
      <h2>Estates</h2>
      <ul>
        {estates.map((estate: any) => (
          <li key={estate.hash_id}>
            <span>
              {`${estate.name} - ${estate.price} Kč; ${getType(estate.type)}`}
            </span>
            <span>
              <a href={estate._links.images[0].href} target="_blank" rel="noopener noreferrer">Obrázek</a>
            </span>
          </li>
        ))}
        <hr />
        {/* <JsonTable rows={estates.map((estate) => {
          return {
            name: estate.name,
            price: estate.price,
            type: estate.type,
            images: estate._links.images[0].href
          }
        })} /> */}
      </ul>
      <button onClick={goToPreviousPage} disabled={page <= 1}>previous page</button>
      <span>page: {page} / {max_page}</span>
      <button onClick={goToNextPage}>next page</button>
      <FormControl>
        <InputLabel id="select-label">Per Page</InputLabel>
        <Select
          labelId="select-label"
          id="select"
          value={perPage}
          label="Per Page"
          onChange={(e) => setPerPage(Number(e.target.value))}
        >
          {PER_PAGE_OPTIONS.map((option) => (
            <MenuItem key={option} value={option}>{option}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </section>
  )
}


const getType = (type: 1 | 2 | 3) => {
  switch (type) {
    case 1:
      return 'prodej';
    case 2:
      return 'pronájem';
    case 3:
      return 'dražba';
  }
}