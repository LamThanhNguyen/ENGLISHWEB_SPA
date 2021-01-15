import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocialAuthService } from 'angularx-social-login';
import { AccountService } from '../_services/account.service';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})

export class NavComponent implements OnInit {
    model: any = {};

    constructor(
        public accountService: AccountService,
        private router: Router,
        private authService: SocialAuthService,
    ) { }

    ngOnInit(): void {
        
    }

    login() {
        this.accountService.login(this.model).subscribe(() => {
            this.router.navigateByUrl('/');
            console.log("Đăng Nhập Thành Công!");
        }, error => {
            console.log(error);
        })
    }

    logout() {
        this.accountService.logout();
        if (localStorage.getItem('loginwithgoogle') === "Đang Login Bằng Tài Khoản Google") {
            this.authService.signOut();
            localStorage.removeItem('loginwithgoogle');
        }
        this.router.navigateByUrl('/');
    }
}