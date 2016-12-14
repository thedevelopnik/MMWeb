import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as uuid from 'uuid'
import UserRegistrationService from '../../../services/cognito.UserRegistration.service'
import { CognitoCallback, CognitoUtil } from '../../../services/cognitoUtil.service';
import { RegistrationUser } from '../../../types/classes'

/**
 * This component is responsible for displaying and controlling
 * the registration of the user
 */
@Component({
  selector: `app-register`,
  templateUrl: './register-teacher.html'
})
export default class RegisterTeacherComponent implements CognitoCallback, OnInit {
  registrationUser: RegistrationUser;
  router: Router;
  errorMessage: string

  constructor(private configs: CognitoUtil, private userRegistration: UserRegistrationService, router: Router) {
    this.router = router;
  }

  ngOnInit() {
    const id = uuid()
    this.registrationUser = new RegistrationUser(id, true);
    this.errorMessage = null;
  }

  onRegister() {
    this.errorMessage = null;
    this.userRegistration.register(this.registrationUser, this);
  }

  cognitoCallback(message: string, result: any) {
    if (message !== null) {
      this.errorMessage = message;
      console.log(`result: ${this.errorMessage}`)
    } else {
      console.log(`redirecting to confirmation page`)
      const username = result.user.username
      this.router.navigate([`/confirm`, username])
    }
  }
}
