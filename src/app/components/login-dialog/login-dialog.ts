import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap, map, first } from 'rxjs/operators';

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, RouterModule],
  templateUrl: './login-dialog.html',
  styleUrls: ['./login-dialog.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginDialogComponent {
  loginForm: FormGroup;
  previousUrl: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private dialogRef: MatDialogRef<LoginDialogComponent>,
    private router: Router
  ) {
    this.previousUrl = this.router.url;
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email], [this.emailAvailabilityValidator()]],
      password: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(8)]]
    });

    this.loginForm.get('email')?.statusChanges.subscribe(status => {
      const passwordControl = this.loginForm.get('password');
      if (status === 'VALID') {
        passwordControl?.enable();
      } else {
        passwordControl?.disable();
      }
    });
  }

  emailAvailabilityValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      return control.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(email => this.authService.checkEmailAvailability(email)),
        map(isAvailable => (isAvailable ? null : { emailTaken: true })),
        first()
      );
    };
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: () => {
          this.dialogRef.close();
          this.router.navigateByUrl(this.previousUrl);
        },
        error: () => {
          this.loginForm.setErrors({ loginFailed: true });
        }
      });
    }
  }

  openSignUp() {
    this.dialogRef.close();
    this.router.navigate(['/signup'], { state: { previousUrl: this.previousUrl } });
  }
}

