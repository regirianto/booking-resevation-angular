import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookComponent } from './book.component';
import { BookRoutingModule } from './book-routing.module';
import { BooklistComponent } from './booklist/booklist.component';
import { BookformComponent } from './bookform/bookform.component';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { Book } from './models/book.models';
import { RouterModule } from '@angular/router';

export interface IBookFormComponent {
  booking?: Book;
  bookingGroup: FormGroup;
  onSubmitReservation(): void;
  onFormReset(): void;
}

export interface IBookListComponent {
  bookings: Book[];
  onReserve(booking: Book): void;
  onCheckIn(bookingId: number): void;
  onCheckOut(bookingId: number): void;
  onDeleteReservation(bookingId: number): void;
}

@NgModule({
  declarations: [BookComponent, BooklistComponent, BookformComponent],
  imports: [
    CommonModule,
    BookRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule,
  ],
})
export class BookModule {}
