import { inject, Inject, Injectable } from '@angular/core';
import { Book } from '../models/books.model';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  private _books: Book[] = [];
  private readonly _booksSubject = new BehaviorSubject<Book[]>([]);

  private readonly _httpClient: HttpClient = inject(HttpClient);
  private _snackBar: MatSnackBar = inject(MatSnackBar);

  getBooksAsObservableNotification(): Observable<Book[]> {
    return this._booksSubject.asObservable();
  }

  processBooks(book: Book): void {
    if (book.id) {
      this._updateBook(book);
    } else {
      this._addNewBook(book);
    }

    this._booksSubject.next(this._books);
  }

  removeBook(id: string): void {
    this._books = this._books.filter(book => book.id !== id);
    this._booksSubject.next(this._books);
  }

  defaultListOfBooks(): Observable<void> {
    return this._httpClient.get(
      `https://www.googleapis.com/books/v1/volumes?q=a&startIndex=${Math.floor(Math.random() * (700 - 10 + 1) + 10)}&maxResults=20`
    ).pipe(
        tap((data: any) => {
          this._books = data.items.map((book: any) => ({
            id: book.id,
            title: book.volumeInfo.title,
            year: book.volumeInfo.publishedDate,
            author: book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown',
          }));

          this._booksSubject.next(this._books);
        }),
      catchError((err) => {
        this._snackBar.open('Something went wrong with Google Api!', 'Close', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          duration: 4000
        });
        this._booksSubject.next([]);

        return throwError(() => new Error(err));
      })
      )
  }

  private _updateBook(book: Book): void {
    this._books = this._books.map((existingBook) =>
      existingBook.id === book.id ? { ...existingBook, ...book } : existingBook
    );
  }

  private _addNewBook(book: Book): void {
    const newBook = { ...book, id: crypto.randomUUID() };
    this._books = [...this._books, newBook];
  }
}
