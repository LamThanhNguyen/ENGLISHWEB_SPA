import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Vocabulary } from '../_models/vocabulary';
import { PaginationParams } from '../_models/paginationParams';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';
import { pipe } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class VocabularyService {
    baseUrl = environment.apiUrl;

    constructor(
        private http: HttpClient,
    ) { }

    createvocabulary(model: any) {
        return this.http.post(this.baseUrl + 'vocabulary/create', model).pipe(
            map(() => {

            })
        )
    }

    updateVocabulary(vocabulary: Vocabulary) {
        return this.http.put(this.baseUrl + 'vocabulary/update/', vocabulary).pipe(
            map(() => {

            })
        )
    }

    deleteVocabulary(Id: number) {
        return this.http.delete(this.baseUrl + 'vocabulary/delete/' + Id);
    }

    getVocabularyById(Id: number) {
        return this.http.get<Vocabulary>(this.baseUrl + 'vocabulary/getvocabularybyid/' + Id);
    }

    getVocabularyByVietName(vietname: string) {
        return this.http.get<Vocabulary>(this.baseUrl + 'vocabulary/getvocabularybyvietname/' + vietname);
    }

    getVocabularyByEngName(engname: string) {
        return this.http.get<Vocabulary>(this.baseUrl + 'vocabulary/getvocabularybyengname/' + engname);
    }

    getVocabularies(vocabularyParams: PaginationParams) {
        let params = getPaginationHeaders(vocabularyParams.pageNumber, vocabularyParams.pageSize);

        return getPaginatedResult<Vocabulary[]>(this.baseUrl + 'vocabulary/getvocabularies', params, this.http)
            .pipe(map(response => {
                return response;
            })
        )
    }
}