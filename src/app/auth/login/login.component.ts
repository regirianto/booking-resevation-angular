import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LoginField } from '../models/login-field.models';
import { Login, LoginToken } from '../models/login.models';
import { AuthService } from '../services/auth.services';
import { map, Observable, Subscription } from 'rxjs';
import { SessionService } from 'src/app/shared/services/session.services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  field: typeof LoginField = LoginField;
  showPassword: boolean = false;
  jwt: Login | null = JSON.parse(this.sessionService.get('token'));

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly activateRoute: ActivatedRoute,
    private readonly sessionService: SessionService
  ) {}

  loginForm: FormGroup<any> = new FormGroup({
    [LoginField.EMAIL]: new FormControl('', [Validators.required]),
    [LoginField.PASSWORD]: new FormControl('', [Validators.required]),
  });
  get email(): AbstractControl {
    return this.loginForm.get('email')!;
  }
  get password(): AbstractControl {
    return this.loginForm.get('password')!;
  }

  ngOnInit(): void {
    if (this.jwt) {
      this.router.navigateByUrl('');
    }
  }

  onSubmit(): void {
    const payload = this.loginForm.value;

    if (!payload.email || !payload.password) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Email atau Password salah',
      });
      return;
    }
    this.authService.login(payload).subscribe({
      next: (token: LoginToken | null) => {
        if (token) {
          this.activateRoute.queryParams
            .pipe(map((params) => params['next'] || null))
            .subscribe((next: string = '') => {
              this.router.navigateByUrl(next).finally();
            });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Email atau Password salah',
          });
        }
      },

      error: (err) => console.error(err.message),
    });
  }

  isFieldValid(loginField: LoginField): string {
    const control: AbstractControl = this.loginForm.get(
      loginField
    ) as AbstractControl;
    if (control && control.touched && control.invalid) {
      return 'is-invalid';
    } else if (control && control.valid) {
      return 'is-valid';
    } else {
      return '';
    }
  }
}
