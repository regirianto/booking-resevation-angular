import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { map } from 'rxjs';
import { SessionService } from 'src/app/shared/services/session.services';
import { nightlyFee } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { IBookFormComponent } from '../book.module';
import { Book } from '../models/book.models';
import { Guest } from '../models/guest.models';
import { BookService } from '../service/book.service';

@Component({
  selector: 'app-bookform',
  templateUrl: './bookform.component.html',
  styleUrls: ['./bookform.component.scss'],
})
export class BookformComponent implements OnInit, IBookFormComponent {
  constructor(
    private readonly bookService: BookService,
    private readonly sessionService: SessionService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  booking?: Book | undefined;
  id?: number;

  editedBook: Book = JSON.parse(this.sessionService.get('editBook')) || '';

  bookingGroup: FormGroup<any> = new FormGroup({
    nama: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.required]),
    nohandphone: new FormControl(null, [Validators.required]),
    nokamar: new FormControl(null, [Validators.required]),
    durasimenginap: new FormControl(null, [Validators.required]),
    jumlahtamu: new FormControl(null, [Validators.required]),
  });

  get email(): AbstractControl {
    return this.bookingGroup.get('email')!;
  }
  get nama(): AbstractControl {
    return this.bookingGroup.get('nama')!;
  }
  get nohandphone(): AbstractControl {
    return this.bookingGroup.get('nohandphone')!;
  }
  get nokamar(): AbstractControl {
    return this.bookingGroup.get('nokamar')!;
  }
  get durasimenginap(): AbstractControl {
    return this.bookingGroup.get('durasimenginap')!;
  }
  get jumlahtamu(): AbstractControl {
    return this.bookingGroup.get('jumlahtamu')!;
  }

  onFormReset(): void {
    this.bookingGroup.reset();
  }

  ngOnInit(): void {
    this.route.params
      .pipe(
        map((params: Params) => {
          return params['id'] ? +params['id'] : null;
        })
      )
      .subscribe((id: any) => {
        this.bookService.get(id).subscribe({
          next: (book) => (this.booking = book),
        });
        this.id = id; // pengecekan sweetAlert2
        this.setFormValue();
      });
  }

  setFormValue(): void {
    if (this.booking) {
      this.email?.setValue(this.booking);
      this.nama?.setValue(this.booking.reservee.name);
      this.email?.setValue(this.booking.reservee.email);
      this.nohandphone?.setValue(this.booking.reservee.phone);
      this.durasimenginap?.setValue(this.booking.duration);
      this.nokamar?.setValue(this.booking.roomNumber);
      this.jumlahtamu?.setValue(this.booking.guestCount);
      this.email.disable();
      this.nama.disable();
      this.nohandphone.disable();
      this.jumlahtamu.disable();
    } else if (this.bookingGroup) {
      this.bookingGroup.reset();
    }
  }

  onSubmitReservation(): void {
    const total: number = nightlyFee * this.durasimenginap.value;

    if (this.id) {
      const guest: Guest = {
        id: this.booking!.reservee.id,
        name: this.nama.value,
        email: this.email.value,
        phone: this.nohandphone.value,
      };
      this.booking = {
        id: this.booking!.id,
        status: this.booking!.status,
        roomNumber: this.nokamar.value,
        duration: this.durasimenginap.value,
        guestCount: this.jumlahtamu.value,
        reservee: guest,
      };
      this.bookService.save(this.booking!).subscribe();
      this.onFormReset();
      this.router.navigateByUrl('book');
      return;
    }
    const guest: Guest = {
      id: Math.floor(Math.random() * 10000),
      name: this.nama.value,
      email: this.email.value,
      phone: this.nohandphone.value,
    };
    this.booking = {
      id: Math.floor(Math.random() * 1 * 10000),
      status: 'reserved',
      roomNumber: this.nokamar.value,
      duration: this.durasimenginap.value,
      guestCount: this.jumlahtamu.value,
      reservee: guest,
    };

    for (const key in this.bookingGroup.value) {
      if (!this.bookingGroup.value[key]) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Isi Semua Form Terlebih Dahulu',
        });
        return;
      }
    }

    Swal.fire({
      title: 'Are you sure?',
      text: `Apakah Kamu Yakin Ingin Memesan Hotel dengan harga Total ${total}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yakin!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.bookService.save(this.booking!).subscribe();
        this.onFormReset();
        Swal.fire(
          `Berhasil Pesan Hotel!`,
          `Tamu ${this.booking?.reservee.name} telah melakukan pemesanan untuk kamar ${this.booking?.roomNumber} selama ${this.booking?.duration} malam dengan total tagihan sebesar ${total}.`,
          'success'
        );
      }
    });
  }
}
