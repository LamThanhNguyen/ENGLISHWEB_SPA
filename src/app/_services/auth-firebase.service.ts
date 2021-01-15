import { Injectable, NgZone } from '@angular/core';
import { AdminFirebase } from '../_models/admin-firebase';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Injectable ({
    providedIn: 'root'
})

export class AuthFirebaseService {
    adminData: any;

    constructor(
        private firebaseStore: AngularFirestore,
        private firebaseAuth: AngularFireAuth,
        private router: Router,
        private ngZone: NgZone
    ) {

        // Lưu thông tin admin trong localStorage khi đăng nhập và xóa dữ liệu
        // khi logout.
        this.firebaseAuth.authState.subscribe(admin => {
            if (admin) {
                this.adminData = admin;
                localStorage.setItem('admin', JSON.stringify(this.adminData));
                JSON.parse(localStorage.getItem('admin'));
            } else {
                localStorage.setItem('admin', null);
                JSON.parse(localStorage.getItem('admin'));
            }
        })
    }


    // Đăng nhập tới Firebase
    SignIn(email, password) {
        return this.firebaseAuth.signInWithEmailAndPassword(email, password)
            .then((result) => {
                this.ngZone.run(() => {
                    console.log("Login successful!!!");
                });
                this.SetUserData(result.user)
            }).catch((error) => {
                window.alert(error.message);
            })
    }

    SetUserData(admin) {
        const adminRef: AngularFirestoreDocument<any> = this.firebaseStore.doc(`users/${admin.uid}`);                            
        const adminData: AdminFirebase = {
            uid: admin.uid,
            email: admin.email,
            displayName: admin.displayName
        }
        return adminRef.set(adminData, {
            merge: true
        })                  
    }

    // Đăng xuất khỏi firebase
    SignOut() {
        return this.firebaseAuth.signOut().then(() => {
            localStorage.removeItem('admin');
        })
    }
}