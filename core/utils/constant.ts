import path from "path";

export class Constants {
    static readonly TIMEOUT: number = 30000;
    static readonly LONG_TIMEOUT: 60000;
    static readonly PARENT_PATH: string = Constants.definePath(__dirname, "../..");

    static definePath(...segments: string[]): string {
        return path.resolve(...segments);
    }
}