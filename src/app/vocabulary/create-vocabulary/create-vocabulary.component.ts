import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { FileUpLoad } from 'src/app/_models/fileupload';
import { AuthFirebaseService } from 'src/app/_services/auth-firebase.service';
import { UploadFileService } from 'src/app/_services/upload-file.service';
import { VocabularyService } from 'src/app/_services/vocabulary.service';

@Component({
    selector: 'create-vocabulary',
    templateUrl: './create-vocabulary.component.html',
    styleUrls: ['./create-vocabulary.component.css']
})

export class CreateVocabulary implements OnInit {
    @Output() cancelVocabulary = new EventEmitter();
    vocabularyForm: FormGroup;
    validationErrors: string[] = [];
    selectedFiles: FileList;
    currentFileUpload: FileUpLoad;
    percentage: number;
    fileUploads: any[];
    private basePath = '/uploads';
    image: string;


    constructor(
        private vocabularyService: VocabularyService,
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
        this.vocabularyForm = this.fb.group({
            vietName: ['', Validators.required],
            engName: ['', Validators.required],
            image: [''],
            description: ['', Validators.required]
        })
    }

    createVocabulary() {
        this.vocabularyService.createvocabulary(this.vocabularyForm.value).subscribe(() => {
            console.log("Khởi tạo thành công!");
            this.router.navigateByUrl('/');
        }, error => {
            this.validationErrors = error;
        })
    }

    cancel() {
        this.cancelVocabulary.emit(false);
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
                    this.vocabularyForm.get('image').setValue(this.image);
                    fileUpload.url = downloadURL;
                    fileUpload.name = fileUpload.file.name;
                    this.saveFileData(fileUpload);
                    this.authFirebaseService.SignOut().then((res1: any) => {

                    });
                });
            })
        ).subscribe();

        return uploadTask.percentageChanges();
    }

    upload() {
        this.authFirebaseService.SignIn('17110324@student.hcmute.edu.vn', 'admin123456*').then((res: any) => {
            const file = this.selectedFiles.item(0);
            this.selectedFiles = undefined;
            this.currentFileUpload = new FileUpLoad(file);

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