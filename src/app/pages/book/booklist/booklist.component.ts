import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import Swal from 'sweetalert2';
import { IBookListComponent } from '../book.module';
import { Book } from '../models/book.models';
import { BookService } from '../service/book.service';
import { nightlyFee } from '../../../../environments/environment';

@Component({
  selector: 'app-booklist',
  templateUrl: './booklist.component.html',
  styleUrls: ['./booklist.component.scss'],
})
export class BooklistComponent implements OnInit, IBookListComponent {
  constructor(private readonly bookService: BookService) {}
  bookings: Book[] = [];
  editedBook: Book | undefined;
  @Output() editedbookEmiter = new EventEmitter<any>();
  HotelPrice: number = nightlyFee;

  addEditedBookValue(book: Book): void {
    this.editedbookEmiter.emit(this.editedBook);
  }
  onReserve(booking: Book): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.loadBook();
  }

  loadBook(): void {
    this.bookService.list().subscribe((result) => (this.bookings = result));
  }

  onDeleteTodo(book: Book): void {}

  onDeleteReservation(bookingId: number): void {
    const book: Book | undefined = this.bookings.find((b) => b.id == bookingId);
    if (book!.status === 'checked-in' || book!.status === 'reserved') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: ` Data pemesanan tidak dapat di hapus karena tamu ${
          book!.reservee.name
        } belum checkout`,
      });
    } else {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.bookService.remove(book!.id).subscribe();
          Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
        }
      });
    }
  }
  onCheckIn(bookingId: number): void {
    const book: Book | undefined = this.bookings.find((b) => b.id == bookingId);
    if (book?.status === 'checked-in') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `Tamu ${book.reservee.name} sudah check-in pada kamar ${book.roomNumber}.`,
      });
    } else if (book?.status === 'checked-out') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `Tamu ${book.reservee.name} sudah melakukan check-out pada kamar ${book.roomNumber}.`,
      });
    } else {
      Swal.fire({
        title: 'Are you sure?',
        text: `Apakah anda ingin melakukan checkin pada tamu ${book?.reservee.name} di kamar ${book?.roomNumber}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yakin!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.bookService.checkIn(bookingId).subscribe();
          Swal.fire(
            'Succes Check-in!',
            `Tamu ${book?.reservee.name} pada kamar ${book?.roomNumber} berhasil checkin`,
            'success'
          );
        }
      });
    }
  }

  onCheckOut(bookingId: number): void {
    const book: Book | undefined = this.bookings.find((b) => b.id == bookingId);
    if (book?.status === 'checked-out') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `Tamu ${book.reservee.name} sudah check-out pada kamar ${book.roomNumber}.`,
      });
    } else if (book?.status === 'reserved') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `Tamu ${book.reservee.name} Harus Check-in terlebih dahulu pada kamar ${book.roomNumber}.`,
      });
    } else {
      Swal.fire({
        title: 'Are you sure?',
        text: `Apakah anda ingin melakukan checkout pada tamu ${book?.reservee.name} di kamar ${book?.roomNumber}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yakin!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.bookService.checkOut(bookingId).subscribe();
          Swal.fire(
            'Succes Check-out!',
            `Tamu ${book?.reservee.name} pada kamar ${book?.roomNumber} berhasil checkout`,
            'success'
          );
        }
      });
    }
  }

  onGetBook(book: Book): void {
    this.bookService.get(book.id).subscribe();
  }
}
