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

    async fetch<T>(method: Method, options: {
        validation?: (body: any) => Promise<T>,
        path?: string,
        body?: any,
        headers?: HeadersInit,
        onLocation?: (url?: string) => any
    }): Promise<T> {
        const apiKey = localStorage.getItem("api-key");
        const headers = new Headers(options.headers);
        headers.set("Accept", "application/json");
        headers.set("Content-Type", "application/json");
        if (apiKey) {
            headers.set("X-Api-Key", apiKey);
        }
        const effectiveUrl = !options.path ? this.rootUrl : `${this.rootUrl}/${options.path}`
        return fetch(effectiveUrl, {
            headers,
            method,
            body: !options.body ? undefined : JSON.stringify(options.body)
        }).then(res => {
            if (res.status >= 400) {
                throw new Error(res.statusText)
            }
            const locationStr =  res.headers.get("Location")
            if (locationStr != null && options.onLocation) {
                options.onLocation(locationStr);
            }
            const lengthStr =  res.headers.get("Content-Length")
            const length = lengthStr != null ? Number.parseInt(lengthStr, 10) : 0;
            const contentType = res.headers.get("Content-Type")
            if (options.validation && length > 0 && contentType.startsWith("application/json")) {
                return res.json().then(options.validation);
            }
            return Promise.resolve(undefined);
        })
    }
}
