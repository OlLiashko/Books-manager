import { Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AddBookComponent } from '../dialogs/add-book/add-book.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BooksService } from '../../services/books.sevice';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from '@angular/material/table';
import { catchError, filter, Observable, of, switchMap, tap } from 'rxjs';
import { Book } from '../../models/books.model';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { ConfirmationDialogComponent } from '../dialogs/confirmation-dialog/confirmation-dialog.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    MatButton,
    ReactiveFormsModule,
    CommonModule,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatIcon,
    MatTooltip,
  ],
  templateUrl: './main-page.component.html',
})
export class MainPageComponent implements OnInit {
  books$: Observable<Book[]>;

  displayedColumns: string[] = ['title', 'author', 'year', 'control'];

  @ViewChild(MatTable) table: MatTable<Book>;

  private readonly _dialog = inject(MatDialog);
  private readonly _booksService: BooksService = inject(BooksService);
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);
  private _snackBar: MatSnackBar = inject(MatSnackBar);

  ngOnInit() {
    this.books$ = this._booksService.defaultListOfBooks()
      .pipe(
        catchError(() => of(void 0)),
        switchMap(() => this._booksService.getBooksAsObservableNotification().pipe(tap(() => this.table?.renderRows())))
      );
  }

  openDialog(book?: Book, preview = false): void {
    this._dialog.open(AddBookComponent, {
      data: {...book, preview},
      width: '550px'
    });
  }

  removeBook(id: string): void {
    const dialogRef = this._dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Delete Book',
        description: 'Are you sure you want to delete this book?',
      }
    });

    dialogRef.afterClosed()
      .pipe(
        filter(Boolean),
        tap(() => this._booksService.removeBook(id)),
        takeUntilDestroyed(this._destroyRef)
      ).subscribe(() => this._snackBar.open('Removed!', 'Close', {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 4000
    }));
  }
}
