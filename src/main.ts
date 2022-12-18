import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { ENVVARIABLE } from './app/util/constants';
import { environment } from './environments/environment';
import { setUrl } from './environments/settingUrl';
import { Router } from '@angular/router';

if (environment.production) {
  enableProdMode();
}



platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => {
    
    console.log(err.message)

    if(err.message == '"undefined" is not valid JSON'){
      localStorage.removeItem('userData')
      window.location.href = '/'
    }
    
    
  });
