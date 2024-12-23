import { base_url } from "./Constants";

export default {
    get(path: string, params?: any): Promise<any> {
        var requestOptions = {
            method: 'GET',
            'Content-Type': 'application/pdf',
        }

        var url = new URL(`${base_url}/${path}`);
        if (params) {
            Object.keys(params).forEach(key =>
                url.searchParams.append(key, params[key])
            );
        }

        return fetch(url.href, requestOptions)
            .then(res => res.json())
            .then(data => {
                return data
            })
    },

    post(path: string, data?: object, params?: any): Promise<any> {
        var requestOptions = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': "application/json"
            }
        }

        var url = new URL(`${base_url}/${path}`);
        if (params) {
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
        }

        //@ts-ignore
        return fetch(url.href, requestOptions)
            .then(res => res.json())
            .then(data => {
                return data;
            })
    },

    put(path: string, data: object): Promise<any> {
        var requestOptions = {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': "application/json"
            }
        }

        return fetch(`${base_url}/${path}`, requestOptions)
            .then(res => res.json())
            .then(data => {
                return data;
            })
    },
}