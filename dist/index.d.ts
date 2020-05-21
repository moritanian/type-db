interface IModelDescribe {
    name: string;
    columns: Record<string, any>;
    primaryKey: string;
    autoIncrement: boolean;
}
export default class TypeDB {
    private storePath;
    private modelDict;
    constructor(storePath: string);
    load(): Promise<void>;
    save(): Promise<void>;
    getModel<Describe extends IModelDescribe>(modelDescribe: Describe): Model<Describe>;
}
declare class Model<Describe extends IModelDescribe> {
    private describe;
    private priCounter;
    private recordsDict;
    constructor(records: Describe['columns'][], describe: Describe);
    new(obj?: Partial<Describe['columns']>): Describe['columns'];
    all(): Describe['columns'][];
    delete(primaryValue: any): boolean;
    find(primaryValue: any): Describe['columns'];
    findBy(key: keyof Describe['columns'], value: Describe['columns'][keyof Describe['columns']]): Describe['columns'] | null;
    private get primaryKey();
    where(condition: Partial<Describe['columns']>): Describe['columns'][];
}
export {};
