import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { CreateUserDto, UserService } from 'src/app/core/user.service';
import { emailValidator, passwordMatch, passwordMatch2 } from '../util';
import { IconService } from 'src/app/core/icon.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  icons: { [key: string]: any };
  passwordControl = new UntypedFormControl(null, [Validators.required, Validators.minLength(5)]);

  get passwordsGroup(): UntypedFormGroup {
    return this.registerFormGroup.controls['passwords'] as UntypedFormGroup;
  }

  registerFormGroup: UntypedFormGroup = this.formBuilder.group({
    'account':new UntypedFormControl('personal', [ Validators.required]),
    'username': new UntypedFormControl(null, [Validators.required, Validators.minLength(5)]),
    'email': new UntypedFormControl(null, [Validators.required, emailValidator]),
    'passwords': new UntypedFormGroup({
      'password': this.passwordControl,
      'rePassword': new UntypedFormControl(null, [passwordMatch(this.passwordControl)]),
    }),
    'tel': new UntypedFormControl(''),
  })

  constructor(
    private formBuilder: UntypedFormBuilder, 
    private authService: AuthService, 
    private router: Router,
    private iconService: IconService) { 
      this.icons = this.iconService.getIcons();
    }

  ngOnInit(): void {
  }

  shouldShowErrorForControl(controlName: string, sourceGroup: UntypedFormGroup = this.registerFormGroup) {
    return sourceGroup.controls[controlName].touched && sourceGroup.controls[controlName].invalid
  }

  handleRegister(): void {
    const { username, email, passwords, tel, account } = this.registerFormGroup.value;

    const body: CreateUserDto = {
      username: username,
      email: email,
      password: passwords.password,
      account: account,
      // ...(tel && { tel: telRegion + tel})
    }

    if (tel) {
      body.tel = tel;
    }

    this.authService.register$(body).subscribe(() => {
      this.router.navigate(['/events']);
    })
  }
}
