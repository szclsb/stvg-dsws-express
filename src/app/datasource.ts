import {Config} from "./config";
import {Db, MongoClient} from "mongodb";

export class Datasource {
    private client?: MongoClient;

    async connect(config: Config): Promise<Db> {
        this.client = await MongoClient.connect(`mongodb+srv://${config.dbUser}:${config.dbPassword}@${config.dbConnection}`);
        console.log(`connected to ${config.dbConnection}`)
        return this.client.db(config.dbName);
    }

    async close(): Promise<any> {
        await this.client?.close();
    }
}
