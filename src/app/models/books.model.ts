import { FormControl } from '@angular/forms';

export interface Book {
  title: string;
  author: string;
  year: number;
  preview?: boolean;
  id?: string;
}

export interface AddBookForm {
  title: FormControl<string>;
  author: FormControl<string>;
  year: FormControl<number>;
}
