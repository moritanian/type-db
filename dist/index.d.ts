declare type PrimaryType = string | number;
interface IModelDescribe {
    name: string;
    columns: Record<string, unknown>;
    primaryKey: string;
    autoIncrement: boolean;
}
export declare class TypeDB {
    private storePath;
    private modelDict;
    constructor(storePath: string);
    load(): Promise<void>;
    save(): Promise<void>;
    getRepository<Describe extends IModelDescribe>(modelDescribe: Describe): Repository<Describe>;
}
export declare class Repository<Describe extends IModelDescribe> {
    private records;
    private db;
    private describe;
    private priCounter;
    private mapping;
    constructor(describe: Describe, records: Record<any, Describe['columns']>, db: TypeDB);
    save(): Promise<void>;
    new(obj?: Partial<Describe['columns']>): Describe['columns'];
    all(): Describe['columns'][];
    delete(primaryValue: PrimaryType): boolean;
    find(primaryValue: PrimaryType): Describe['columns'] | null;
    findBy(key: keyof Describe['columns'], value: Describe['columns'][keyof Describe['columns']]): Describe['columns'] | null;
    private get primaryKey();
    where(condition: Partial<Describe['columns']>): Describe['columns'][];
}
export {};
