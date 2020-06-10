import * as fs from 'fs';
type PrimaryType = string | number;

interface IModelDescribe {
  name: string,
  columns: Record<string, unknown>,
  primaryKey: string,
  autoIncrement: boolean
};

export class TypeDB {
  private modelDict: {[modelName: string]: any} = {};
  constructor(private storePath?: string) {
  }

  public async load() {
    if(!this.storePath) {
      return;
    }
    const d = await fs.promises.readFile(this.storePath, 'utf-8');
    this.modelDict = JSON.parse(d);
  }

  public async save() {
    if(!this.storePath) {
      return;
    }
    const d = JSON.stringify(this.modelDict);
    await fs.promises.writeFile(this.storePath, d);
  }

  public getRepository<Describe extends IModelDescribe>(modelDescribe: Describe): Repository<Describe>{
    if(!this.modelDict[modelDescribe.name]) {
      this.modelDict[modelDescribe.name] = {};
    }
    return new Repository<Describe>(modelDescribe, this.modelDict[modelDescribe.name], this);
  }
}

export class Repository<Describe extends IModelDescribe> {
  private describe: Describe;
  private priCounter: number = 0;
  private mapping = {}; // #TODO
  constructor(describe: Describe, private records: Record<any, Describe['columns']>, private db: TypeDB) {
    this.describe = describe;
   
    if(describe.autoIncrement) {
      for(let key in this.records) {
        if(this.priCounter < (this.records[key][this.describe.primaryKey] as number)) {
          this.priCounter = this.records[key][this.describe.primaryKey] as number;
        }
      }
    }
  }

  save() {
    return this.db.save();
  }

  new(obj: Partial<Describe['columns']> = {}): Describe['columns'] {
    const newRecord: Describe['columns'] = Object.assign({}, this.describe.columns, obj);
    if(this.describe.autoIncrement) {
      newRecord[this.primaryKey] = (++this.priCounter) as any;
    }
    if(newRecord[this.describe.primaryKey] as string | number in this.records) {
      throw new Error('Primary key error');
    }
    this.records[newRecord[this.describe.primaryKey] as string | number] = newRecord;

    return newRecord;
  }

  all(): Describe['columns'][] {
    return Object.keys(this.records)
      .map(key => this.records[key]);
  }

  delete(primaryValue: PrimaryType): boolean {
    const record = this.find(primaryValue);
    if(!record) {
      return false;
    }
    delete this.records[primaryValue];

    return true;
  }

  find(primaryValue: PrimaryType): Describe['columns'] | null {
    return this.records[primaryValue] || null;
  }

  findBy(key: keyof Describe['columns'], value: Describe['columns'][keyof Describe['columns']]): Describe['columns'] | null {
    const condition: Partial<Describe['columns']> = {}; //{[key]: value};
    condition[key] = value;
    const list = this.where(condition);
    if(list.length === 0) {
      return null;
    }
    return list[0];
  }

  private get primaryKey(): keyof Describe['columns'] {
    return this.describe.primaryKey;
  }

  where(
    condition: Partial<Describe['columns']>
  ): Describe['columns'][] {
    condition = Object.assign({}, condition);
    if(this.describe.primaryKey in condition) {
      const primaryKey = this.describe.primaryKey as keyof(typeof condition); // # TODO
      const record = this.find(condition[primaryKey] as PrimaryType);
      return record ? [record] : [];
    }
    return  this.all()
      .filter(record => Object.keys(condition).every(key => record[key] === condition[key]));
  }
}
