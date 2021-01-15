import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GrammarListComponent } from './grammar/grammar-list/grammar-list.component';
import { LoginWithGoogleComponent } from './loginwithgoogle/login-with-google';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { PracticeListComponent } from './practice/practice-list/practice-list.component';
import { RegisterComponent } from './register/register.component';
import { CreateVocabulary } from './vocabulary/create-vocabulary/create-vocabulary.component';
import { VocabularyDetailComponent } from './vocabulary/vocabulary-detail/vocabulary-detail.component';
import { VocabularyEditComponent } from './vocabulary/vocabulary-edit/vocabulary-edit.component';
import { VocabularyListComponent } from './vocabulary/vocabulary-list/vocabulary-list.component';
import { AdminGuard } from './_guards/admin.guard';
import { AuthGuard } from './_guards/auth.guard';


const routes: Routes = [
  {path: '', component: VocabularyListComponent},
  {path: 'vocabulary/detail/:id', component: VocabularyDetailComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'loginwithgoogle', component: LoginWithGoogleComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      {path: 'member/edit', component: MemberEditComponent},
      {path: 'grammarlist', component: GrammarListComponent},
      {path: 'practicelist', component: PracticeListComponent},
      {path: 'vocabulary/add', component: CreateVocabulary, canActivate: [AdminGuard]},
      {path: 'vocabulary/edit/:id', component: VocabularyEditComponent, canActivate: [AdminGuard]},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { }
