import { title } from 'process';
import {TypeDB, Repository} from '../../src/index';

export const BookDescribe = {
  name: 'Book',
  columns: {
    id: 0,
    title: '',
    category: '',
    price: 0
  },
  primaryKey: 'id',
  autoIncrement: true
};


export function setBooks(bookRepo: Repository<typeof BookDescribe>) {
  bookRepo.new({title: 'Book1', category: 'Fiction', price: 100});
  bookRepo.new({title: 'Book2', category: 'Non-Fiction', price: 200});
  bookRepo.new({title: 'Book3', category: 'Fiction', price: 300});
}
