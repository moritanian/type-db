import * as chai from 'chai';

import TypeDB from '../src/index';

const UserDescribe = {
  name: 'User',
  columns: {
    id: 0,
    firstName: '',
    lastName: '',
    sex: 'male' as 'male' | 'female' | 'other',
    age: 0
  },
  primaryKey: 'id',
  autoIncrement: true
};

describe('Create', () => {
  it('all default value', () => {
    const db = new TypeDB('./test-data/');
    const userModel = db.getModel(UserDescribe);
    const user1 = userModel.new();
    chai.assert.strictEqual(user1.firstName, '');
    chai.assert.strictEqual(user1.lastName, '');
    chai.assert.strictEqual(user1.sex, 'male');
    chai.assert.strictEqual(user1.age, 0);
  });

  it('with some options', () => {
    const db = new TypeDB('./test-data/');
    const userModel = db.getModel(UserDescribe);
    const user1 = userModel.new({firstName: 'Komari', lastName: 'Koshigaya', sex: 'female', age: 13});
    chai.assert.strictEqual(user1.firstName, 'Komari');
    chai.assert.strictEqual(user1.lastName, 'Koshigaya');
    chai.assert.strictEqual(user1.sex, 'female');
    chai.assert.strictEqual(user1.age, 13);
  });

  it('auto increment', () => {
    const db = new TypeDB('./test-data/');
    const userModel = db.getModel(UserDescribe);
    const user1 = userModel.new({firstName: 'Komari', lastName: 'Koshigaya', sex: 'female', age: 13});
    const user2 = userModel.new({firstName: 'Komari', lastName: 'Koshigaya', sex: 'female', age: 13});
    chai.assert.strictEqual(user1.id, 1);
    chai.assert.strictEqual(user2.id, 2); 
  });
});

describe('find', () => {
});

describe('findBy', () => {
});

describe('delete', () => {
});
