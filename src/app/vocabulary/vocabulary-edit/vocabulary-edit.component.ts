import { Component, OnInit, ViewChild, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { Vocabulary } from '../../_models/vocabulary';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { FileUpLoad } from 'src/app/_models/fileupload';
import { VocabularyService } from 'src/app/_services/vocabulary.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UploadFileService } from 'src/app/_services/upload-file.service';
import { AuthFirebaseService } from 'src/app/_services/auth-firebase.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
    selector: 'vocabulary-edit',
    templateUrl: './vocabulary-edit.component.html',
    styleUrls: ['./vocabulary-edit.component.css']
})

export class VocabularyEditComponent implements OnInit {
    @Output() cancelVocabulary = new EventEmitter();
    id: any;
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
        private route: ActivatedRoute,
        private uploadService: UploadFileService,
        private authFirebaseService: AuthFirebaseService,
        private db: AngularFireDatabase,
        private storage: AngularFireStorage
    ) {

    }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.id = params.get('id');
        });
        this.initializeForm(this.id);
    }

    initializeForm(id: any) {
        this.vocabularyService.getVocabularyById(id).subscribe((response: any) => {
            this.vocabularyForm = this.fb.group({
                id: [response.id, Validators.required],
                vietName: [response.vietName, Validators.required],
                engName: [response.engName, Validators.required],
                image: [response.image],
                description: [response.description, Validators.required]
            });
            this.image = this.vocabularyForm.get('image').value;
        });
    }

    updateVocabulary() {
        this.vocabularyService.updateVocabulary(this.vocabularyForm.value).subscribe((res: any) => {
            this.router.navigateByUrl('/');
        });
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
                    this.authFirebaseService.SignOut().then((res1: any) => {

                    });
                },
                error => {
                    console.log(error);
                }
            );
        })
    }
}