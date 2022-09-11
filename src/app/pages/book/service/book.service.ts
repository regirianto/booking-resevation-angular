import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { SessionService } from 'src/app/shared/services/session.services';
import { Book } from '../models/book.models';
import { Guest } from '../models/guest.models';

const BOOK_KEY = 'books';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  books: Book[] = [];
  constructor(private readonly sessionService: SessionService) {}

  list(): Observable<Book[]> {
    return new Observable<Book[]>((observer: Observer<Book[]>) => {
      const bookValue: string = this.sessionService.get(BOOK_KEY);
      try {
        const books: Book[] = bookValue
          ? JSON.parse(bookValue)
          : [
              {
                id: 1,
                status: 'reserved',
                roomNumber: 1,
                duration: '2',
                guestCount: 2,
                reservee: {
                  name: 'Budi',
                  email: 'budi@gmail.com',
                  nokamar: 17,
                  nohandphone: '0823238856',
                },
              },
            ];
        this.books = books;
        this.updateSessionStorage();
        observer.next(books);
      } catch (err: any) {
        observer.error(err);
      }
      observer.complete();
    });
  }

  save(book: Book): Observable<void> {
    return new Observable<void>((observer: Observer<void>) => {
      try {
        const checkBooks: number = this.books.findIndex((b) => b.id == book.id);
        console.log(book);

        if (checkBooks < 0) {
          this.books.push(book);
          this.updateSessionStorage();
          console.log('Yang gak ada');
        } else {
          this.books[checkBooks] = book;
          console.log('Yang ada');
          console.log(book);

          this.updateSessionStorage();
        }
        observer.next();
      } catch (error) {
        observer.error(error);
      }
      observer.complete();
    });
  }
  private updateSessionStorage(): void {
    this.sessionService.set(BOOK_KEY, JSON.stringify(this.books));
  }

  remove(id: number): Observable<void> {
    return new Observable<void>((observer: Observer<void>) => {
      try {
        const bookId: number = this.books.findIndex((item) => item.id == id);
        this.books.splice(bookId, 1);
        this.updateSessionStorage();
        observer.next();
      } catch (error) {
        observer.error(error);
      }
      observer.complete();
    });
  }

  checkIn(bookingId: number): Observable<void> {
    return new Observable<void>((observer: Observer<void>) => {
      try {
        const book: number = this.books.findIndex((b) => b.id == bookingId);
        this.books[book].status = 'checked-in';

        this.updateSessionStorage();

        observer.next();
      } catch (error) {
        observer.error(error);
      }
      observer.complete();
    });
  }

  checkOut(bookingId: number): Observable<void> {
    return new Observable<void>((observer: Observer<void>) => {
      try {
        const book: number = this.books.findIndex((b) => b.id == bookingId);
        this.books[book].status = 'checked-out';

        this.updateSessionStorage();

        observer.next();
      } catch (error) {
        observer.error(error);
      }
      observer.complete();
    });
  }

  edit(book: Book): Observable<void> {
    return new Observable<void>((observer: Observer<void>) => {
      try {
        const findBook: number = this.books.findIndex((e) => e.id == book.id);
        this.books[findBook] = book;
        observer.next();
      } catch (error) {
        observer.error(error);
      }
      observer.complete();
    });
  }

  get(bookingId: number): Observable<Book> {
    return new Observable<Book>((observer: Observer<Book>) => {
      try {
        const allBook = this.books.find(
          (todo) => todo.id === bookingId
        ) as Book;
        observer.next(allBook);
      } catch (err: any) {
        observer.next(err.messsage);
      }
      observer.complete();
    });
  }
}
