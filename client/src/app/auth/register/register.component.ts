import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  passwordControl = new FormControl(null, [Validators.required, Validators.minLength(5)]);

  get passwordsGroup(): FormGroup {
    return this.registerFormGroup.controls['passwords'] as FormGroup;
  }

  registerFormGroup: FormGroup = this.formBuilder.group({
    'account':new FormControl('personal', [ Validators.required]),
    'username': new FormControl(null, [Validators.required, Validators.minLength(5)]),
    'email': new FormControl(null, [Validators.required, emailValidator]),
    'passwords': new FormGroup({
      'password': this.passwordControl,
      'rePassword': new FormControl(null, [passwordMatch(this.passwordControl)]),
    }),
    'tel': new FormControl(''),
  })

  constructor(
    private formBuilder: FormBuilder, 
    private authService: AuthService, 
    private router: Router,
    private iconService: IconService) { 
      this.icons = this.iconService.getIcons();
    }

  ngOnInit(): void {
  }

  shouldShowErrorForControl(controlName: string, sourceGroup: FormGroup = this.registerFormGroup) {
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
      this.router.navigate(['/home']);
    })
  }
}
