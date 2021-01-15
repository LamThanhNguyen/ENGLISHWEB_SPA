import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Member } from '../../_models/member';
import { User } from '../../_models/user';
import { AccountService } from '../../_services/account.service';
import { MembersService } from '../../_services/members.service';
import { finalize, take } from 'rxjs/operators';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FileUpLoad } from 'src/app/_models/fileupload';
import { AuthFirebaseService } from 'src/app/_services/auth-firebase.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-member-edit',
    templateUrl: './member-edit.component.html',
    styleUrls: ['./member-edit.component.css']
})

export class MemberEditComponent implements OnInit {
    member: Member;
    user: User;
    updateForm: FormGroup;
    selectedFiles: FileList;
    currentFileUpload: FileUpLoad;
    percentage: number;
    fileUploads: any[];
    private basePath = '/uploads';
    image: string;
    validationErrors: string[] = [];

    constructor(
        private accountService: AccountService,
        private memberService: MembersService,
        private router: Router,
        private fb: FormBuilder,
        private authFirebaseService: AuthFirebaseService,
        private db: AngularFireDatabase,
        private storage: AngularFireStorage
    ) {
        this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
    }

    ngOnInit(): void {
        this.loadMember();
    }

    loadMember() {
        this.memberService.getMember(this.user.username).subscribe(member => {
            this.member = member;
            this.updateForm = this.fb.group({
                city: [member.city, Validators.required],
                country: [member.country, Validators.required],
                photoUrl: [member.photoUrl]
            });
            this.image = this.updateForm.get('photoUrl').value;
        })
    }

    updateMember() {
        this.memberService.updateMember(this.updateForm.value).subscribe(() => {
            this.router.navigateByUrl('/');
        });
    }

    cancel() {
        this.router.navigateByUrl('/');
    }

    selectFile(event) {
        this.selectedFiles = event.target.files;
    }

    private saveFileData(fileUpload: FileUpLoad) {
        this.db.list(this.basePath).push(fileUpload);
    }

    pushFileToStorage(fileUpload: FileUpLoad): Observable<number> {
        const filePath = `${this.basePath}/${fileUpload.file.name}`;
        const storageRef = this.storage.ref(filePath);
        const uploadTask = this.storage.upload(filePath, fileUpload.file);

        uploadTask.snapshotChanges().pipe(
            finalize(() => {
                storageRef.getDownloadURL().subscribe(downloadURL => {
                    this.image = downloadURL;
                    //this.registerForm.patchValue({photoUrl: this.image});
                    this.updateForm.get('photoUrl').setValue(this.image);
                    fileUpload.url = downloadURL;
                    fileUpload.name = fileUpload.file.name;
                    this.saveFileData(fileUpload);
                    this.authFirebaseService.SignOut().then((res1: any) => {

                    });
                });
            })
        ).subscribe();

        // Trả về phần trăm hoàn thành việc tải lên.
        return uploadTask.percentageChanges();
    }

    upload() {
        this.authFirebaseService.SignIn('17110324@student.hcmute.edu.vn', 'admin123456*').then((res: any) => {
            const file = this.selectedFiles.item(0);
            // Set lại nơi chưa file
            this.selectedFiles = undefined;

            this.currentFileUpload = new FileUpLoad(file);

            // Push file để upload.
            this.pushFileToStorage(this.currentFileUpload).subscribe(
                percentage => {
                    this.percentage = Math.round(percentage);
                },
                error => {
                    console.log(error);
                }
            );
        })
    }
}