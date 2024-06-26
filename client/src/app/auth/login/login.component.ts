import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { MessageBusService, MessageType } from 'src/app/core/message-bus.service';
import { UserService } from 'src/app/core/user.service';
import { emailValidator } from '../util';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { IconService } from 'src/app/core/icon.service';

const myRequired = (control: AbstractControl) => {
  // console.log('validator called');
  return Validators.required(control);
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  icons: { [key: string]: any };
  errorMessage: string = '';

  loginFormGroup: UntypedFormGroup = this.formBuilder.group({
    email: new UntypedFormControl('', { validators: [myRequired, emailValidator], updateOn: 'submit' }),
    password: new UntypedFormControl(null, [Validators.required, Validators.minLength(5)])
  });

  constructor(
    private formBuilder: UntypedFormBuilder,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private messageBus: MessageBusService,
    private router: Router,
    private iconService: IconService) { 
      this.icons = this.iconService.getIcons();
    }

  ngOnInit(): void {

    // this.loginFormGroup.get('email').valueChanges.subscribe(value => {
    //   console.log('email changed', value);
    // })
  }

  loginHandler(): void {
    // TODO stoimenovg: validate user's data.
    // this.userService.login();
    // this.router.navigate(['/home']);

    // console.log('fromClickHandler', this.loginFormGroup.valid);
  }

  handleLogin(): void {
    // console.log('fromNgSubmit', this.loginFormGroup.valid);

    this.errorMessage = '';
    this.authService.login$(this.loginFormGroup.value).subscribe({
      next: () => {
        if (this.activatedRoute.snapshot.queryParams['redirect-to']) {
          this.router.navigateByUrl(this.activatedRoute.snapshot.queryParams['redirect-to'])
        } else {
          this.router.navigate(['/events']);
        }

        this.messageBus.notifyForMessage({ text: 'User successfully logged in!', type: MessageType.Success })
      },
      complete: () => {
        console.log('login stream completed')
      },
      error: (err) => {
        this.errorMessage = err.error.message;
      }
    });
  }
}
