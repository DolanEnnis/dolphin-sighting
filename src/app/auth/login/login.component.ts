import {Component, inject} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {AuthService} from '../../shared/services/auth.service';


@Component({
    selector: 'app-login',
    imports: [ReactiveFormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
  fb = inject(FormBuilder)
  http= inject(HttpClient);
  authService = new AuthService();
  router = inject(Router);

  form =this.fb.nonNullable.group({
    email:['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
  errorMessage: string | null  = null;

  onSubmit(): void{
    const rawForm = this.form.getRawValue()
    this.authService
      .login(rawForm.email, rawForm.password)
      .subscribe({
        next:() =>
        {
          this.router.navigateByUrl('/');
        },
        error:(err) =>
          this.errorMessage = err.code
      });
  }

}
