import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { UserService } from '../../services/user.service';
import { ComponentBase } from '../component-base/component-base.component';
import { CommonModule } from '@angular/common';
import { MessagingService } from '../../services/messaging.service';

@Component({
  selector: 'app-registration',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PanelModule,
    InputTextModule,
    IftaLabelModule,
    ButtonModule,
    DialogModule,
    RouterModule,
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent extends ComponentBase {
  constructor(
    readonly formBuilder: FormBuilder,
    readonly userService: UserService,
    readonly router: Router,
    readonly messagingService: MessagingService,
  ) {
    super();
  }

  registrationForm!: FormGroup;
  submitting = false;

  ngOnInit() {
    this.registrationForm = this.formBuilder.group({
      userName: ['', [Validators.required]],
      displayName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password1: ['', [Validators.required, Validators.minLength(6)]],
      password2: ['', [Validators.required]],
    }, { validators: this.passwordsMatchValidator });
  }

  passwordsMatchValidator(form: FormGroup) {
    const pass1 = form.get('password1')?.value;
    const pass2 = form.get('password2')?.value;
    return pass1 === pass2 ? null : { passwordsMismatch: true };
  }

  async submit() {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const registration = this.registrationForm.value;

    try {
      await this.userService.register(registration);
      this.router.navigate(['/']);
    } catch (err) {
      this.messagingService.sendUserMessage({
        level: 'error',
        content: `There was an error logging in: ${err}`
      });
    }
    finally {
      this.submitting = false;
    }
  }
}
