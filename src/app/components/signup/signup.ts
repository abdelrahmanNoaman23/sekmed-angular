import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, RouterModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupComponent {
  signupForm: FormGroup;
  previousUrl: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.previousUrl = this.router.getCurrentNavigation()?.extras.state?.['previousUrl'] || '/home';
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const { email, password } = this.signupForm.value;
      this.authService.signup(email, password).subscribe({
        next: () => {
          this.router.navigateByUrl(this.previousUrl);
        },
        error: () => {
          this.signupForm.setErrors({ signupFailed: true });
        }
      });
    }
  }
}
