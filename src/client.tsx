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
        const effectiveUrl = !url ? this.rootUrl : `${this.rootUrl}/${url}`
        return fetch(effectiveUrl, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            method,
            body: !body ? undefined : JSON.stringify(body)
        }).then(res => {
            if (res.status >= 400) {
                throw new Error(res.statusText)
            }
            const lengthStr =  res.headers.get("Content-Length")
            const length = lengthStr != null ? Number.parseInt(lengthStr, 10) : 0;
            const contentType = res.headers.get("Content-Type")
            return length > 0 && contentType.startsWith("application/json") ? res.json() as T: undefined
        })
    }
}
