import { Component, OnInit } from '@angular/core';
import { Pagination } from 'src/app/_models/pagination';
import { Vocabulary } from 'src/app/_models/vocabulary';
import { PaginationParams } from 'src/app/_models/paginationParams';
import { VocabularyService } from 'src/app/_services/vocabulary.service';
import { AccountService } from 'src/app/_services/account.service';

@Component({
    selector: 'vocabulary-list',
    templateUrl: './vocabulary-list.component.html',
    styleUrls: ['./vocabulary-list.component.css']
})

export class VocabularyListComponent implements OnInit {
    vocabularies: Vocabulary[];
    pagination: Pagination;
    vocabularyParams: PaginationParams = new PaginationParams();

    constructor(
        public accountService: AccountService,
        private vocabularyService: VocabularyService,
    ) { }

    ngOnInit(): void {
        this.loadVocabularies();
    }

    loadVocabularies() {
        this.vocabularyService.getVocabularies(this.vocabularyParams).subscribe(response => {
            this.vocabularies = response.result;
            this.pagination = response.pagination
        })
    }

    onPageChange(pageNum: number) {
        this.vocabularyParams.pageNumber = pageNum;
        this.loadVocabularies();
    }
}