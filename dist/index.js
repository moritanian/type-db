"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
;
class TypeDB {
    constructor(storePath) {
        this.storePath = storePath;
        this.modelDict = {};
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            const d = yield fs.promises.readFile(this.storePath, 'utf-8');
            this.modelDict = JSON.parse(d);
        });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            const d = JSON.stringify(this.modelDict);
            yield fs.promises.writeFile(this.storePath, d);
        });
    }
    getModel(modelDescribe) {
        return new Model(this.modelDict[modelDescribe.name], modelDescribe);
    }
}
exports.default = TypeDB;
class Model {
    constructor(records, describe) {
        this.priCounter = 0;
        this.recordsDict = {};
        this.describe = describe;
        this.recordsDict[this.describe.primaryKey] = {};
        records.forEach(record => {
            let primaryValue = record[this.describe.primaryKey];
            this.recordsDict[this.describe.primaryKey][primaryValue] = record;
        });
        if (describe.autoIncrement) {
            this.priCounter = Math.max.apply(records.map(record => record[this.describe.primaryKey]));
        }
    }
    new(obj = {}) {
        const newRecord = Object.assign({}, this.describe.columns, obj);
        if (this.describe.autoIncrement) {
            newRecord[this.primaryKey] = (++this.priCounter);
        }
        return newRecord;
    }
    all() {
        return Object.keys(this.recordsDict[this.describe.primaryKey])
            .map(key => this.recordsDict[this.describe.primaryKey][key]);
    }
    delete(primaryValue) {
        const record = this.find(primaryValue);
        if (!record) {
            return false;
        }
        delete this.recordsDict[this.describe.primaryKey][primaryValue];
        return true;
    }
    find(primaryValue) {
        return this.recordsDict[this.describe.primaryKey][primaryValue];
    }
    findBy(key, value) {
        const condition = {}; //{[key]: value};
        condition[key] = value;
        const list = this.where(condition);
        if (list.length === 0) {
            return null;
        }
        return list[0];
    }
    get primaryKey() {
        return this.describe.primaryKey;
    }
    where(condition) {
        condition = Object.assign({}, condition);
        if (this.describe.primaryKey in condition) {
            const primaryKey = this.describe.primaryKey; // # TODO
            return [this.find(condition[primaryKey])];
        }
        return this.all()
            .filter(record => Object.keys(condition).every(key => record[key] === condition[key]));
    }
}
//# sourceMappingURL=index.js.map