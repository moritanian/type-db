# Type-DB
![CI](https://github.com/moritanian/type-db/workflows/CI/badge.svg)
[![codecov](https://codecov.io/gh/moritanian/type-db/branch/master/graph/badge.svg)](https://codecov.io/gh/moritanian/type-db)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

## Pure typescript Database
- Type system base
- Pure typescript library (no native code)
- Store its data as JSON file or in memory

## Usage
```javascript
import {TypeDB} from 'type-db';


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

const db = new TypeDB('path/to/db.json');
await db.load();
/*
 * Or in memory db:
 *
 * const db = new TypeDB();
 */

const userRepository = db.getRepository(UserDescribe);

// Create
const user1 = userRepository.new({firstName: 'Komari', lastName: 'Koshigaya', sex: 'female', age: 13});
await db.save();

// Update
user1.age = 14
await db.save();

// Delete
userRepository.delete(user1);
await db.save();

// Search
userRepository.find(1);
const femaleUser = userRepository.findBy('sex': 'female');
const thirtyYearsMales = userRepository.where({sex: 'male', age: 30});



```