export interface Config {
    port: number,
    dbConnection: string,
    dbUser: string,
    dbPassword: string,
    dbName: string,
    apiKeyHeader: string,
    apiKey: string,
    secret: string
    user: string,
}

export function loadConfig(json: any): Config {
    if (!json.dbConnection || !json.dbUser || !json.dbPassword || !json.dbName || !json.secret) {
        throw Error("invalid configuration: missing database parameters");
    }
    const port = readValue(json.port) ?? "8080";
    return {
        port: parseInt(port, 10),
        dbConnection: readValue(json.dbConnection),
        dbUser: readValue(json.dbUser),
        dbPassword: readValue(json.dbPassword),
        dbName: readValue(json.dbName),
        apiKeyHeader: readValue(json.apiKeyHeader),
        apiKey: readValue(json.apiKey),
        secret: readValue(json.secret),
        user: readValue(json.user),
    }
}

function readValue(value?: string): string | undefined {
    if (value.startsWith('$ENV:')) {
        return process.env[value.substring(5)];
    }
    return value;
}
