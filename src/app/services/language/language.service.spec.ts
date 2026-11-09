import { TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Subject } from 'rxjs';

import { LanguageService } from './language.service';

describe('LanguageService', () => {
  let service: LanguageService;
  let currentPath: string;
  let translate: jasmine.SpyObj<TranslateService>;
  let location: jasmine.SpyObj<Location>;
  let defaultLangChange: Subject<LangChangeEvent>;

  beforeEach(() => {
    currentPath = '';
    defaultLangChange = new Subject<LangChangeEvent>();
    translate = jasmine.createSpyObj('TranslateService', ['addLangs', 'setDefaultLang'], {
      onDefaultLangChange: defaultLangChange,
    });
    location = jasmine.createSpyObj('Location', ['go', 'path']);
    location.path.and.callFake(() => currentPath);

    TestBed.configureTestingModule({
      providers: [
        { provide: TranslateService, useValue: translate },
        { provide: Location, useValue: location },
      ],
    });
    service = TestBed.inject(LanguageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('uses the language from the URL over the browser language', () => {
    currentPath = '/en';
    spyOnProperty(navigator, 'language').and.returnValue('es-CO');

    service.initLanguage();

    expect(service.language).toBe('en');
    expect(translate.setDefaultLang).toHaveBeenCalledWith('en');
    expect(location.go).toHaveBeenCalledWith('en');
  });

  it('falls back to the browser language when the URL has no language', () => {
    currentPath = '';
    spyOnProperty(navigator, 'language').and.returnValue('es-CO');

    service.initLanguage();

    expect(service.language).toBe('es');
  });

  it('ignores unsupported URL segments', () => {
    currentPath = '/fr';
    spyOnProperty(navigator, 'language').and.returnValue('en-US');

    service.initLanguage();

    expect(service.language).toBe('en');
  });

  it('syncs html lang, title and meta tags with the active language', () => {
    currentPath = '/en';
    service.initLanguage();
    defaultLangChange.next({
      lang: 'en',
      translations: { 'Meta.Title': 'EN title', 'Meta.Description': 'EN description' },
    });

    expect(document.documentElement.lang).toBe('en');
    expect(document.title).toBe('EN title');
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toBe('EN description');
    expect(document.querySelector('meta[property="og:locale"]')?.getAttribute('content')).toBe('en_US');
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe('https://juandavid.cv/en');
  });
});
