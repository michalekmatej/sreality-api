
export type StrapiResponse = {
    data: any;
    meta: {
        pagination: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        };
    };
}


export class API {
    // --------- private methods ----------

    private static callAPI = async (url: string, params?: string, method: string = 'GET', body?: any): Promise<StrapiResponse> => {
        // if url does not start with /, add it
        if (!url.startsWith('/')) {
            url = `/${url}`;
        }
        // if url does not contain ?, params should start with ?, otherwise with &
        if (params && !url.includes('?')) {
            params = `?${params}`;
        } else if (params) {
            params = `&${params}`;
        }

        const _domain = `${import.meta.env.VITE_API_URL}`;
        const _wholeURL = `${_domain}${url}${params ? params : ''}`;

        const response = await fetch(
            _wholeURL,
            {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${import.meta.env.VITE_API_TOKEN}`
                },
                body: body ? JSON.stringify(body) : undefined
            });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const json = await response.json();
        return json as StrapiResponse;
    }

    // --------- public methods ----------

    static getArticles = async (params?: string): Promise<StrapiResponse> => {
        return API.callAPI(`/posts`, params);
    }

    static getArticle = async (slug: string, params?: string): Promise<StrapiResponse> => {
        return API.callAPI(`/posts?filters[url][$eq]=${slug}`, params);
    }

    static getServices = async (params?: string): Promise<StrapiResponse> => {
        return API.callAPI(`/services`, params);
    }

    static getService = async (slug: string, params?: string): Promise<StrapiResponse> => {
        return API.callAPI(`/services?filters[url][$eq]=${slug}`, params);
    }
}