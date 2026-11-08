import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  language: "es" | "en";

  constructor(
    public translateService: TranslateService,
    private location: Location,
  ) {}

  initLanguage(){
    this.translateService.addLangs(["en", "es"])
    // A language in the URL (e.g. a shared juandavid.cv/en link) wins over the browser language.
    const urlLanguage = this.location.path().split("/").filter(Boolean)[0]
    let language: "es" | "en"
    if (urlLanguage === "es" || urlLanguage === "en") {
      language = urlLanguage
    } else {
      const browserLanguage: string = navigator.language || (navigator as any).userLanguage || ""
      language = browserLanguage.split("-").includes("es") ? "es" : "en"
    }
    this.translateService.setDefaultLang(language)

    // Change the URL without navigate:
    this.location.go(language)

    this.language=language
  }

  changeLanguage(language){
    this.translateService.setDefaultLang(language)
    this.location.go(language)
    this.language=language
  }
}
