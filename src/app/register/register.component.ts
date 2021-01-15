import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, Validators, FormBuilder, ValidatorFn, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { FileUpLoad } from '.././_models/fileupload';
import { AuthFirebaseService } from '.././_services/auth-firebase.service';
import { UploadFileService } from '.././_services/upload-file.service';
import { map } from 'rxjs/operators';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { formatCurrency } from '@angular/common';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
    @Output() cancelRegister = new EventEmitter();
    registerForm: FormGroup;
    validationErrors: string[] = [];
    selectedFiles: FileList;
    currentFileUpload: FileUpLoad;
    percentage: number;
    fileUploads: any[];
    private basePath = '/uploads';
    image: string;

    constructor(
        private accountService: AccountService,
        private fb: FormBuilder,
        private router: Router,
        private uploadService: UploadFileService,
        private authFirebaseService: AuthFirebaseService,
        private db: AngularFireDatabase,
        private storage: AngularFireStorage
    ) { }

    ngOnInit(): void {
        this.initializeForm();
    }

    initializeForm() {
        this.registerForm = this.fb.group({
            gender: ['male'],
            username: ['', Validators.required],
            knownAs: ['', Validators.required],
            dateOfBirth: ['', Validators.required],
            city: ['', Validators.required],
            country: ['', Validators.required],
            photoUrl: [''],
            password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
            confirmPassword: ['', [Validators.required, this.matchValues('password')]]
        })
    }

    // Nếu trùng khớp password thì trả về null. Không thì trả về Object mismatch=true
    matchValues(matchTo: string): ValidatorFn {
        return (control: AbstractControl) => {
            return control?.value === control?.parent?.controls[matchTo].value ? null : {isMatching: true}
        }                                                 
    }

    register() {
        debugger;
        const dateOfBirth = this.registerForm.get('dateOfBirth').value;
        const date = new Date(dateOfBirth.year, dateOfBirth.month, dateOfBirth.day);
        this.registerForm.get('dateOfBirth').setValue(date);
        this.accountService.register(this.registerForm.value).subscribe((response: any) => {
            this.router.navigateByUrl('/');
        }, error => {
            this.validationErrors = error;
        });
    }

    // Sự kiện cancelRegister đưa ra giá trị false.
    cancel() {
        this.cancelRegister.emit(false);
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
                    this.registerForm.get('photoUrl').setValue(this.image);
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