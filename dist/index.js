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
exports.Repository = exports.TypeDB = void 0;
const processQueue_1 = require("./processQueue");
const fs = require("fs");
;
class TypeDB {
    constructor(storePath) {
        this.storePath = storePath;
        this.modelDict = {};
        this.writeQueue = new processQueue_1.ProcessQueue();
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.storePath) {
                return;
            }
            const d = yield fs.promises.readFile(this.storePath, 'utf-8');
            this.modelDict = JSON.parse(d);
        });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            const storePath = this.storePath;
            if (!storePath) {
                return;
            }
            const d = JSON.stringify(this.modelDict);
            //await fs.promises.writeFile(storePath, d);
            yield this.writeQueue.push(() => fs.promises.writeFile(storePath, d));
        });
    }
    getRepository(modelDescribe) {
        if (!this.modelDict[modelDescribe.name]) {
            this.modelDict[modelDescribe.name] = {};
        }
        return new Repository(modelDescribe, this.modelDict[modelDescribe.name], this);
    }
}
exports.TypeDB = TypeDB;
class Repository {
    constructor(describe, records, db) {
        this.records = records;
        this.db = db;
        this.priCounter = 0;
        this.mapping = {}; // #TODO
        this.describe = describe;
        if (describe.autoIncrement) {
            for (let key in this.records) {
                if (this.priCounter < this.records[key][this.describe.primaryKey]) {
                    this.priCounter = this.records[key][this.describe.primaryKey];
                }
            }
        }
    }
    save() {
        return this.db.save();
    }
    new(obj = {}) {
        const newRecord = Object.assign({}, this.describe.columns, obj);
        if (this.describe.autoIncrement) {
            newRecord[this.primaryKey] = (++this.priCounter);
        }
        if (newRecord[this.describe.primaryKey] in this.records) {
            throw new Error('Primary key error');
        }
        this.records[newRecord[this.describe.primaryKey]] = newRecord;
        return newRecord;
    }
    all() {
        return Object.keys(this.records)
            .map(key => this.records[key]);
    }
    delete(primaryValue) {
        const record = this.find(primaryValue);
        if (!record) {
            return false;
        }
        delete this.records[primaryValue];
        return true;
    }
    find(primaryValue) {
        return this.records[primaryValue] || null;
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
            const record = this.find(condition[primaryKey]);
            return record ? [record] : [];
        }
        return this.all()
            .filter(record => Object.keys(condition).every(key => record[key] === condition[key]));
    }
}
exports.Repository = Repository;
//# sourceMappingURL=index.js.map