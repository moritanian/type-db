import * as fs from 'fs';

interface IModelDescribe {
  name: string,
  columns: Record<string, any>,
  primaryKey: string,
  autoIncrement: boolean
};

export default class TypeDB {
  private modelDict: {[modelName: string]: any[]} = {};
  constructor(private storePath: string) {
  }

  public async load() {
    const d = await fs.promises.readFile(this.storePath, 'utf-8');
    this.modelDict = JSON.parse(d);
  }

  public async save() {
    const d = JSON.stringify(this.modelDict);
    await fs.promises.writeFile(this.storePath, d);
  }

  public getModel<Describe extends IModelDescribe>(modelDescribe: Describe): Model<Describe>{
    return new Model<Describe>(modelDescribe, this.modelDict[modelDescribe.name] || []);
  }
}

class Model<Describe extends IModelDescribe> {
  private describe: Describe;
  private priCounter: number = 0;
  private recordsDict: Record<string, Record<any, Describe['columns']>> = {};
  constructor(describe: Describe, records: Describe['columns'][] = []) {
    this.describe = describe;
    this.recordsDict[this.describe.primaryKey] = {};
    records.forEach(record => {
      let primaryValue = record[this.describe.primaryKey] as string | number;
      this.recordsDict[this.describe.primaryKey][primaryValue] = record;
    });
    if(describe.autoIncrement) {
      this.priCounter = Math.max.call(null, 0, ...records.map(record => record[this.describe.primaryKey]));
    }
  }

  new(obj: Partial<Describe['columns']> = {}): Describe['columns'] {
    const newRecord: Describe['columns'] = Object.assign({}, this.describe.columns, obj);
    if(this.describe.autoIncrement) {
      newRecord[this.primaryKey] = (++this.priCounter) as any;
    }
    return newRecord;
  }

  all(): Describe['columns'][] {
    return Object.keys(this.recordsDict[this.describe.primaryKey])
      .map(key => this.recordsDict[this.describe.primaryKey][key]);
  }

  delete(primaryValue: any): boolean {
    const record = this.find(primaryValue);
    if(!record) {
      return false;
    }
    delete this.recordsDict[this.describe.primaryKey][primaryValue];
    return true;
  }

  find(primaryValue: any): Describe['columns'] {
    return this.recordsDict[this.describe.primaryKey][primaryValue];
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
      return [this.find(condition[primaryKey])];
    }
    return  this.all()
      .filter(record => Object.keys(condition).every(key => record[key] === condition[key]));
  }
}
