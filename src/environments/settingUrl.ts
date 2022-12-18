/* eslint-disable @typescript-eslint/naming-convention */
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


const env =  [
    {name: 'test', url: 'https://jabiyatest.flai.com.do/api/'},
    {name: 'prod', url: 'https://jabiya.flai.com.do/api/'}
  ]
  
  export let environment = {name: 'prod', url: 'https://jabiya.flai.com.do/api/'}
  
  export const setUrl = (url) => {
    localStorage.setItem('$$envVariable$$', url)
    environment = env.find(x => x.name == url)
  }
  
  