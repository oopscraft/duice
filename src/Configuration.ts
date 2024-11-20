export class Configuration {

    static namespace: string = 'dc';

    static setNamespace(value:string): void {
        this.namespace = value;
    }

    static getNamespace(): string {
        return this.namespace;
    }

}