/* eslint-disable max-len */
import { Component, Input } from '@angular/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { DomSanitizer } from '@angular/platform-browser';


const CACHE_FOLDER = 'CACHED-IMG';

@Component({
  selector: 'app-cached-img',
  templateUrl: './cached-image.component.html',
  styleUrls: ['./cached-image.component.scss'],
})
export class CachedImageComponent {
  @Input() spinner = false;
  @Input() customClass;


  public _src = '';

  constructor(public sanitizer: DomSanitizer) { }

  @Input()
  set src(imageData: string) {
    // if (this.imageHash) {
    this.storeAndLoadImage(imageData);
    // }
  };

  async storeAndLoadImage(imageData) {
    // const imageName = imageData.imageUrl.split('/').pop();
    const hashedImageName = imageData.imageHash; // This split needs to be changed to accommodate the final image url path
    // const fileType = imageData.imageUrl.split('.').pop(); // This methord can be used to dynamically define the file type when the final image url path is set
    // console.log('fileType', fileType);

    Filesystem.readFile({
      directory: Directory.Cache,
      path: `${CACHE_FOLDER}/${hashedImageName}`
    }).then(readFile => {
      // this._src = `data:image/${fileType};base64,${readFile.data}`; // This methord can be used to dynamically define the file type when the final image url path is set
      this._src = `${readFile.data}`;
    }).catch(async e => {
      await this.storeImage(imageData.imageUrl, hashedImageName);
      Filesystem.readFile({
        directory: Directory.Cache,
        path: `${CACHE_FOLDER}/${hashedImageName}`
      }).then(readFile => {
        // this._src = `data:image/${fileType};base64,${readFile.data}`; // This methord can be used to dynamically define the file type when the final image url path is set
        this._src = `${readFile.data}`;
      }).catch((err: any) => {
      });
    });
  }

  // https://forum.ionicframework.com/t/how-to-download-an-image-then-store-it-on-the-device/199841/2
  async storeImage(url, path) {
    const response = await fetch(`${url}`);
    // convert to a Blob
    const blob = await response.blob();

    // convert to base64 data, which the Filesystem plugin requires
    const base64Data = await this.convertBlobToBase64(blob) as string;

    const savedFile = await Filesystem.writeFile({
      path: `${CACHE_FOLDER}/${path}`,
      data: base64Data,
      directory: Directory.Cache
    });
    return savedFile;
  }

  // helper function
  convertBlobToBase64(blob: Blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
  }
}
