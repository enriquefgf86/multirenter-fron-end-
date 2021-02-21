import { DeleteUserSettingsComponent } from './delete-user-settings.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteUserSelectedComponent } from './delete-user-selected/delete-user-selected.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PipeModule } from 'src/app/pipes/pipe.module';



@NgModule({
  declarations: [DeleteUserSettingsComponent,DeleteUserSelectedComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PipeModule,
  ]
})
export class DeleteUserSettingsModuleModule { }
