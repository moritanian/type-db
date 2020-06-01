import {TypeDB, Repository} from '../../src/index';

export const UserDescribe = {
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

export const UserDescribeNoIncrement = {
  ...UserDescribe,
  autoIncrement: false
};

export function setUsers(userRepo: Repository<typeof UserDescribe>) {
  userRepo.new({firstName: 'Komari', lastName: 'Koshigaya', sex: 'female', age: 13});
  userRepo.new({firstName: 'Natsumi', lastName: 'Koshigaya', sex: 'female', age: 12});
  userRepo.new({firstName: 'Suguru', lastName: 'Koshigaya', sex: 'male', age: 14});
  userRepo.new({firstName: 'Renge', lastName: 'Miyauchi', sex: 'male', age: 6});
}
