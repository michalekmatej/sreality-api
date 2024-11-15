import { ThemeToggler } from "@components/ThemeToggler/ThemeToggler";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

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

export default App;

const fetchEstates = async (page: number, perPage: number = 10) => {
  const response = await fetch(`/api/api/cs/v2/estates?per_page=${perPage}&page=${page}`);
  const data = await response.json();
  return data._embedded.estates;
};

export const Test = () => {
  const [page, setPage] = useState(1);
  const perPage = 10;

  const { data: estates, isLoading, isError } = useQuery({
    queryKey: ['estates', page, perPage],
    queryFn: () => fetchEstates(page, perPage),
  });

  const goToPreviousPage = () => {
    if (page <= 1) return;
    setPage(page - 1);
  }

  const goToNextPage = () => {
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
      <button onClick={goToNextPage}>next page</button>
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