export class API {

    public static fetchData = async (page: number = 1, perPage: number = 10) => {
        if (page <= 0 || perPage <= 0) {
            throw new Error('Error fetching data: Page and perPage must be greater than 0');
        }

        try {

            const response = await fetch(`/api/api/cs/v2/estates?per_page=${perPage}&page=${page}`);

            if (!response.ok) {
                throw new Error(`Error fetching data: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error : any) {
            console.error('Error fetching data', error);
            throw new Error(`Error fetching data: ${error.message}`);
        }
    };

}