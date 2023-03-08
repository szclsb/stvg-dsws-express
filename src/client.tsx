export enum Method {
    GET= "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
}

export class Client {
    private rootUrl: string;
    // private headers: Record<string, string>;


    constructor(rootUrl: string) {
        this.rootUrl = rootUrl;
    }

    async fetch<T>(method: Method, url?: string, body?: any): Promise<T> {
        return fetch(!url ? this.rootUrl : `${this.rootUrl}/${url}`, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            method,
            body
        }).then(res => res?.json() as T)
    }
}
