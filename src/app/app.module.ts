import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GoogleLoginProvider, SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { FormUploadComponent } from './upload/form-upload/form-upload.component';
import { ListUploadComponent } from './upload/list-upload/list-upload.component';
import { DetailsUploadComponent } from './upload/details-upload/details-upload.component';
import { GrammarListComponent } from './grammar/grammar-list/grammar-list.component';
import { VocabularyListComponent } from './vocabulary/vocabulary-list/vocabulary-list.component';
import { PracticeListComponent } from './practice/practice-list/practice-list.component';
import { NavComponent } from './nav/nav.component';
import { RegisterComponent } from './register/register.component';
import { TextInputComponent } from './_forms/text-input/text-input.component';
import { SharedModule } from './_modules/shared.module';
import { HasRoleDirective } from './_directives/hasRole.directive';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DateInputComponent } from './_forms/date-input/date-input.component';
import { LoginWithGoogleComponent } from './loginwithgoogle/login-with-google';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { JwtInterceptor } from './_interceptors/jwt.interceptor';
import { CreateVocabulary } from './vocabulary/create-vocabulary/create-vocabulary.component';
import { VocabularyDetailComponent } from './vocabulary/vocabulary-detail/vocabulary-detail.component';
import { VocabularyEditComponent } from './vocabulary/vocabulary-edit/vocabulary-edit.component';
import { VocabularyCardComponent } from './vocabulary/vocabulary-card/vocabulary-card.component';

const googleLoginOptions = {
  scope: 'profile email'
};

@NgModule({
  declarations: [
    AppComponent,
    FormUploadComponent,
    ListUploadComponent,
    DetailsUploadComponent,
    NavComponent,
    GrammarListComponent,
    CreateVocabulary,
    VocabularyListComponent,
    VocabularyCardComponent,
    VocabularyDetailComponent,
    VocabularyEditComponent,
    PracticeListComponent,
    RegisterComponent,
    TextInputComponent,
    DateInputComponent,
    HasRoleDirective,
    LoginWithGoogleComponent,
    MemberEditComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    SharedModule,
    NgbModule,
    SocialLoginModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: true,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '273388055480-r4htkhaci552eisjb01vfo3b5m8rque0.apps.googleusercontent.com',
              googleLoginOptions
            )
          },
        ]
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
