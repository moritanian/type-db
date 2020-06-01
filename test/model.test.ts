import * as chai from 'chai';

import {TypeDB} from '../src/index';

import {UserDescribe, UserDescribeNoIncrement, setUsers} from './test-data/user';

describe('#new()', () => {
  it('all default value', () => {
    const db = new TypeDB('./test-data/');
    const userRepo = db.getRepository(UserDescribe);
    const user1 = userRepo.new();
    chai.assert.strictEqual(user1.firstName, '');
    chai.assert.strictEqual(user1.lastName, '');
    chai.assert.strictEqual(user1.sex, 'male');
    chai.assert.strictEqual(user1.age, 0);
  });

  it('with some options', () => {
    const db = new TypeDB('./test-data/');
    const userRepo = db.getRepository(UserDescribe);
    const user1 = userRepo.new({firstName: 'Komari', lastName: 'Koshigaya', sex: 'female', age: 13});
    chai.assert.strictEqual(user1.firstName, 'Komari');
    chai.assert.strictEqual(user1.lastName, 'Koshigaya');
    chai.assert.strictEqual(user1.sex, 'female');
    chai.assert.strictEqual(user1.age, 13);
  });

  it('auto increment', () => {
    const db = new TypeDB('./test-data/');
    const userRepo = db.getRepository(UserDescribe);
    const user1 = userRepo.new({firstName: 'Komari', lastName: 'Koshigaya', sex: 'female', age: 13});
    const user2 = userRepo.new({firstName: 'Komari', lastName: 'Koshigaya', sex: 'female', age: 13});
    chai.assert.strictEqual(user1.id, 1);
    chai.assert.strictEqual(user2.id, 2); 
  });

  it('failed without auto increment', () => {
    const db = new TypeDB('./test-data/');
    const userRepo = db.getRepository(UserDescribeNoIncrement);
    userRepo.new();
    chai.assert.throw(() => userRepo.new());
  });
});

describe('#delete()', () => {
  it('successfully delete', () => {
    const db = new TypeDB('./test-data/');
    const userRepo = db.getRepository(UserDescribe);
    setUsers(userRepo);
    const user = userRepo.find(1);
    if(!user) {
      throw new Error('user is null');
    }
    const result = userRepo.delete(user.id);
    chai.assert.isTrue(result);
    const u = userRepo.find(user.id);
    chai.assert.isNull(u);
  });

  it('nothing shoud happen when try to delete not existing record', () => {
    const db = new TypeDB('./test-data/');
    const userRepo = db.getRepository(UserDescribe);
    setUsers(userRepo);
    const result = userRepo.delete(-1);
    chai.assert.isFalse(result);
  });
});

describe('find', () => {
  const db = new TypeDB('./test-data/');
  const userRepo = db.getRepository(UserDescribe);
  setUsers(userRepo);
  const user1 = userRepo.find(1);
  chai.assert.strictEqual(user1 && user1.firstName, 'Komari');
});

describe('findBy', () => {
  const db = new TypeDB('./test-data/');
  const userRepo = db.getRepository(UserDescribe);
  setUsers(userRepo);

  it('find one record', () => {
    const user = userRepo.findBy('lastName', 'Koshigaya');
    chai.assert.strictEqual(user && user.lastName, 'Koshigaya');
  });

  it('find no record', () => {
    const user = userRepo.findBy('lastName', 'dummy');
    chai.assert.isNull(user);
  });
 
});

describe('#where()', () => {
  const db = new TypeDB('./test-data/');
  const userRepo = db.getRepository(UserDescribe);
  setUsers(userRepo);

  it('find a record by primary key', () => {
    const users = userRepo.where({id: 1});
    chai.assert.strictEqual(users.length, 1);
    chai.assert.strictEqual(users[0].id, 1);
  });

  it('find no record by primary key', () => {
    const users = userRepo.where({id: -1});
    chai.assert.strictEqual(users.length, 0);
  });

  it('find records with single condition', () => {
    const users = userRepo.where({lastName: 'Koshigaya'});
    chai.assert.strictEqual(users.length, 3);
  });

  it('find records with multiple conditions', () => {
    const users = userRepo.where({lastName: 'Koshigaya', sex: 'female'});
    chai.assert.strictEqual(users.length, 2);
  });

  it('find one record with multiple conditions', () => {
    const users = userRepo.where({id: 1, sex: 'female'});
    chai.assert.strictEqual(users.length, 1);
  });

  it('find no record with single condition', () => {
    const users = userRepo.where({lastName: 'dummy'});
    chai.assert.strictEqual(users.length, 0);
  });
});
 
