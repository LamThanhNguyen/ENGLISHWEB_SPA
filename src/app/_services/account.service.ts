import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { User } from '../_models/user';
import { environment } from 'src/environments/environment';
import { Observable, ReplaySubject } from 'rxjs';
import { DoiTuongTraVe } from '../_models/doituongtrave';

@Injectable({
    providedIn: 'root'
})

export class AccountService {
    baseUrl = environment.apiUrl;
    private currentUserSource = new ReplaySubject<User>(1);
    currentUser$ = this.currentUserSource.asObservable();

    constructor(
        private http: HttpClient,
    )
    { }

    // http://localhost:5000/api/account/login
    login(model: any) {
        return this.http.post(this.baseUrl + 'account/login', model).pipe(
            map((response: User) => {
                const user = response;
                if (user) {
                    this.setCurrentUser(user);
                }
            })
        )
    }

    // http://localhost:5000/api/account/register
    register(model: any) {
        return this.http.post(this.baseUrl + 'account/register', model).pipe(
            map((response: DoiTuongTraVe) => {
                return response;
            })
        )
    }

    setCurrentUser(user: User) {
        user.roles = [];
        // Lấy ra role của user đăng nhập vào từ token của người đăng nhập.
        const roles = this.getDecodedToken(user.token).role;
        // Nếu roles != null thì user.roles = roles 
        Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUserSource.next(user);
    }

    logout() {
        localStorage.removeItem('user');
        this.currentUserSource.next(null);
    }

    // Giải mã token
    getDecodedToken(token) {
        return JSON.parse(atob(token.split('.')[1]));
    }
}