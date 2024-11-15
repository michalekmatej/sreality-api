export class API {

    public static fetchData = async (page: number = 1, perPage: number = 10) => {
        const response = await fetch(`/api/api/cs/v2/estates?per_page=${perPage}&page=${page}`);
        const data = await response.json();
        return data;
    };

}