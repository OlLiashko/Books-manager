import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInput } from '@angular/material/input';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { AddBookForm, Book } from '../../../models/books.model';
import { BooksService } from '../../../services/books.sevice';

@Component({
  selector: 'app-add-book',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    CommonModule,
    MatFormField,
    MatInput,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose,
  ],
  templateUrl: './add-book.component.html',
})
export class AddBookComponent implements OnInit {
  addBookFormGroup: FormGroup<AddBookForm>;

  private readonly _booksService: BooksService = inject(BooksService);

  constructor(@Inject(MAT_DIALOG_DATA) public data: Book) {
  }

  ngOnInit(): void {
    this.addBookFormGroup = this._generateFormGroup();
  }

  addBook(): void {
    const formValue = this.addBookFormGroup.getRawValue();
    const book = this.data?.id ? {...formValue, id: this.data.id} : formValue;

    this._booksService.processBooks(book);
  }

  private _generateFormGroup(): FormGroup<AddBookForm> {
    return new FormGroup<AddBookForm>({
      title: new FormControl({value: this.data?.title ?? '', disabled: !!this.data?.preview}, {
        nonNullable: true,
        validators: [Validators.required]
      }),
      author: new FormControl({value: this.data?.author ?? '', disabled: !!this.data?.preview}, {
        nonNullable: true,
        validators: [Validators.required]
      }),
      year: new FormControl({value: this.data?.year ?? 2000, disabled: !!this.data?.preview}, {
        nonNullable: true,
        validators: [Validators.required]
      }),
    });
  }
}
