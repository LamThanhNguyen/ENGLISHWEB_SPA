import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/_services/account.service';
import { VocabularyService } from 'src/app/_services/vocabulary.service';
import { Vocabulary } from '../../_models/vocabulary';

@Component({
    selector: 'vocabulary-card',
    templateUrl: './vocabulary-card.component.html',
    styleUrls: ['./vocabulary-card.component.css']
})

export class VocabularyCardComponent implements OnInit {
    @Input() vocabulary: Vocabulary;

    constructor(
        public accountService: AccountService,
        private vocabularyService: VocabularyService,
        private router: Router,
    ) {}

    ngOnInit(): void {

    }

    deleteVocabulary(id: any) {
        this.vocabularyService.deleteVocabulary(id).subscribe((response: any) => {
            console.log(response);
        }, error => {
            console.log(error);
        });
    }
}