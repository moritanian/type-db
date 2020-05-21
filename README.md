# Type-DB

## Feature
- Type system base
- Pure typescript library (no native code)
- Store its data as JSON file or in memory

## Usage
```javascript
import TypeDB from 'typedb';


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
const userModel = db.getModel(UserDescribe);

// Create
const user1 = userModel.new({firstName: 'Komari', lastName: 'Koshigaya', sex: 'female', age: 13});
await db.save();

// Update
user1.age = 14
await db.save();

// delete
userModel.delete(user1);
await db.save();

// search
UserModel.find(1);
const femaleUser = UserModel.findBy('sex': 'female');
const thirtyYearsMales = UserModel.where({sex: 'male', age: 30});



```