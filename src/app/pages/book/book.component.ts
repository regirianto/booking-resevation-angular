import { Component, Input, OnInit } from '@angular/core';
import { Book } from './models/book.models';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
})
export class BookComponent implements OnInit {
  books: Book[] = [];
  bookValue?: Book;
  @Input() test: any;

  get book(): Book {
    return this.bookValue as Book;
  }

  constructor() {}

  ngOnInit(): void {}
}
