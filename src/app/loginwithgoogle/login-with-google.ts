import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { SocialAuthService, GoogleLoginProvider, SocialUser } from 'angularx-social-login';
import { AccountService } from '../_services/account.service';

@Component({
   selector: 'login-with-google',
   templateUrl: './login-with-google.html',
   styleUrls: ['./login-with-google.css'] 
})

export class LoginWithGoogleComponent implements OnInit {
    user: SocialUser;
    GoogleLoginProvider = GoogleLoginProvider;
    loggedIn: boolean;

    constructor(
        private authService: SocialAuthService,
        private accountService: AccountService,
        private router: Router,
    ) {}

    ngOnInit() {
        this.authService.authState.subscribe(user => {
            if (user !== null) {
                this.user = user;
                this.loggedIn = true;
                const useregister = {
                    username: user.email,
                    password: 'Lam' + user.id,
                    knownAs: user.name,
                    gender: 'male',
                    photoUrl: user.photoUrl
                };
                this.accountService.register(useregister).subscribe(() => {
                    const userlogin = {
                        username : useregister.username,
                        password : useregister.password,
                    }
                    this.accountService.login(userlogin).subscribe((response: any) => {
                        localStorage.setItem('loginwithgoogle', "Đang Login Bằng Tài Khoản Google");
                        this.router.navigateByUrl('/');
                    }, error1 => {
                        console.log(error1);
                    });
                }, error => {
                    console.log(error);
                });
            } else {
                this.loggedIn = false;
            }
        })
    }

    signInWithGoogle(): void {
        this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    }

    signOut(): void {
        this.authService.signOut();
    }

    refreshGoogleToken(): void {
        this.authService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
    }
}
