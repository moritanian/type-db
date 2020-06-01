import * as chai from 'chai';
import * as fs from 'fs';

import {TypeDB} from '../src/index';

import {UserDescribe} from './test-data/user';

const JSONDir = __dirname + '/json-file/';

async function cleanJSONFiles() {
  const files = await fs.promises.readdir(JSONDir);
  await Promise.all(files.map(file => fs.promises.unlink(JSONDir + file)));
}

beforeEach(cleanJSONFiles);

describe('#save()', () => {
  after(cleanJSONFiles);

  it('should save correctly', async () => {
    const jsonPath = JSONDir + 'test.json';
    const db = new TypeDB(jsonPath);
    const userRepo = db.getRepository(UserDescribe);
    userRepo.new();
    await userRepo.save();
    let fd = null;
    try {
      fd = await fs.promises.open(jsonPath, 'r');
    } catch (e) {
    }
    chai.assert.isNotNull(fd);
  });
});

describe('#load()', () => {
  after(cleanJSONFiles);

  it('should load correctly', async () => {
    const jsonPath = JSONDir + 'test2.json';
    const firstName = 'Tohma';
    const lastName = 'Minami';

    const dummyDb = new TypeDB(jsonPath);
    const dummyRepo = dummyDb.getRepository(UserDescribe);
    dummyRepo.new({firstName, lastName});
    dummyRepo.new({firstName, lastName});
    await dummyRepo.save();

    const db = new TypeDB(jsonPath);
    await db.load();
    const userRepo = db.getRepository(UserDescribe);
    const users = userRepo.all();
    chai.assert.strictEqual(users.length, 2);
    chai.assert.strictEqual(users[0].firstName, firstName);
    chai.assert.strictEqual(users[0].lastName, lastName);
  });
});
