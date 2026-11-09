import { Inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT, Location } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

const SITE_URL = 'https://juandavid.cv';
const OG_LOCALES: Record<'es' | 'en', string> = { es: 'es_CO', en: 'en_US' };

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  language: "es" | "en";

  constructor(
    public translateService: TranslateService,
    private location: Location,
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document,
  ) {
    // Fires once the translations of the new default language are loaded.
    this.translateService.onDefaultLangChange.subscribe(({ lang, translations }) => {
      if (lang === this.language) this.updateTranslatedMetadata(translations)
    })
  }

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
    // Set before setDefaultLang: onDefaultLangChange can fire synchronously when translations are cached.
    this.language=language
    this.updateMetadata(language)
    this.translateService.setDefaultLang(language)

    // Change the URL without navigate:
    this.location.go(language)
  }

  changeLanguage(language){
    this.language=language
    this.updateMetadata(language)
    this.translateService.setDefaultLang(language)
    this.location.go(language)
  }

  /** Keeps <html lang>, the document title and social/SEO meta tags in sync with the active language. */
  private updateMetadata(language: "es" | "en"): void {
    this.document.documentElement.lang = language

    const pageUrl = `${SITE_URL}/${language}`
    const ogLocale = OG_LOCALES[language]
    const ogLocaleAlternate = OG_LOCALES[language === "es" ? "en" : "es"]
    this.meta.updateTag({ property: "og:url", content: pageUrl })
    this.meta.updateTag({ property: "og:locale", content: ogLocale })
    this.meta.updateTag({ property: "og:locale:alternate", content: ogLocaleAlternate })
    this.meta.updateTag({ property: "twitter:url", content: pageUrl })
    this.setCanonical(pageUrl)
  }

  // Translation files use flat keys ("Meta.Title"), so read them straight from the loaded object.
  private updateTranslatedMetadata(translations: Record<string, any>): void {
    const title: string = translations?.["Meta.Title"]
    const description: string = translations?.["Meta.Description"]
    if (title) {
      this.title.setTitle(title)
      this.meta.updateTag({ name: "title", content: title })
      this.meta.updateTag({ property: "og:title", content: title })
      this.meta.updateTag({ property: "twitter:title", content: title })
    }
    if (description) {
      this.meta.updateTag({ name: "description", content: description })
      this.meta.updateTag({ property: "og:description", content: description })
      this.meta.updateTag({ property: "twitter:description", content: description })
    }
  }

  private setCanonical(url: string): void {
    let link = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!link) {
      link = this.document.createElement("link")
      link.setAttribute("rel", "canonical")
      this.document.head.appendChild(link)
    }
    link.setAttribute("href", url)
  }
}
