import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Vocabulary } from '../../_models/vocabulary';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { VocabularyService } from 'src/app/_services/vocabulary.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'vocabulary-detail',
    templateUrl: './vocabulary-detail.component.html',
    styleUrls: ['./vocabulary-detail.component.css']
})

export class VocabularyDetailComponent implements OnInit {
    id: any;
    vocabularyForm: FormGroup;
    image: string;

    constructor(
        private vocabularyService: VocabularyService,
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
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
                image: [response.image],
                description: [response.description, Validators.required]
            });
            this.image = this.vocabularyForm.get('image').value;
        });
    }

    cancel() {
        this.router.navigateByUrl('/');
    }
}