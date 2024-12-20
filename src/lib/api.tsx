import { IFilters } from "@/components/FilterSelectDropdowns/FilterSelectDropdowns";

export class API {

    public static fetchEstates = async (page: number = 1, perPage: number = 10, filters: IFilters = {}) => {
        if (page <= 0 || perPage <= 0) {
            throw new Error('Error fetching data: page and per_page must be greater than 0');
        }

        try {
            // create query string from filters
            let filtersString = '';
            for (const key in filters) {
                if (filters[key]) {
                    filtersString += `&${key}=${filters[key]}`;
                }
            }

            const url = `/api/api/cs/v2/estates?per_page=${perPage}&page=${page}${filtersString}`;
            const response = await fetch(url);
            // const response = await fetch(`/api/api/cs/v2/estates?per_page=${perPage}&page=${page}`);

            if (!response.ok) {
                throw new Error(`Error fetching data: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error: any) {
            console.error('Error fetching data', error);
            throw new Error(`Error fetching data: ${error.message}`);
        }
    };


    public static fetchEstateDetail = async (hash_id: string) => {
        try {
            const url = `/api/api/cs/v2/estates/${hash_id}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Error fetching data: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error: any) {
            console.error('Error fetching data', error);
            throw new Error(`Error fetching data: ${error.message}`);
        }
    };
    
}