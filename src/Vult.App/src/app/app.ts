import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CatalogItemImagesUpload } from "./components/catalog-item-images-upload/catalog-item-images-upload";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CatalogItemImagesUpload],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Vult.App');
}
