import * as chai from 'chai';
import * as fs from 'fs';

import { TypeDB } from '../src/index';

import { setUsers, UserDescribe } from './test-data/user';
import { BookDescribe, setBooks } from './test-data/book';

const JSONDir = __dirname + '/json-file/';

async function cleanJSONFiles() {
  const files = await fs.promises.readdir(JSONDir);
  await Promise.all(
    files.filter(file => file !== '.gitkeep')
      .map(file => fs.promises.unlink(JSONDir + file)));
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
    chai.assert.isTrue(fs.existsSync(jsonPath));
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
    dummyRepo.new({ firstName, lastName });
    dummyRepo.new({ firstName, lastName });
    await dummyRepo.save();

    const db = new TypeDB(jsonPath);
    await db.load();
    const userRepo = db.getRepository(UserDescribe);
    const users = userRepo.all();
    chai.assert.strictEqual(users.length, 2);
    chai.assert.strictEqual(users[0].firstName, firstName);
    chai.assert.strictEqual(users[0].lastName, lastName);
  });

  it('should load correctly with multiple table', async () => {
    const jsonPath = JSONDir + 'test3.json';

    const db1 = new TypeDB(jsonPath);
    const userRepo1 = db1.getRepository(UserDescribe);
    setUsers(userRepo1);
    const bookRepo1 = db1.getRepository(BookDescribe);
    setBooks(bookRepo1);
    await Promise.all([userRepo1, bookRepo1].map(repo => repo.save()));

    const db2 = new TypeDB(jsonPath);
    await db2.load();
    const userRepo2 = db2.getRepository(UserDescribe);
    const bookRepo2 = db2.getRepository(BookDescribe);
    chai.assert.isTrue(userRepo2.all().length > 0);
    chai.assert.isTrue(bookRepo2.all().length > 0);
  });
});
