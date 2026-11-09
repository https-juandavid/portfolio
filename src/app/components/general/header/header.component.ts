import { Component, OnInit, ViewChild, HostListener, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import {trigger, style, query, transition, stagger, animate } from '@angular/animations'
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';
import { UntypedFormControl } from '@angular/forms';
import { LanguageService } from 'src/app/services/language/language.service';
import { prefersReducedMotion } from 'src/app/utils/reduced-motion';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    animations: [
        trigger("animateMenu", [
            transition(":enter", [
                query("*", [
                    style({ opacity: 0, transform: "translateY(-50%)" }),
                    stagger(50, [
                        animate("250ms cubic-bezier(0.35, 0, 0.25, 1)", style({ opacity: 1, transform: "none" }))
                    ])
                ])
            ])
        ])
    ],
    standalone: false
})
export class HeaderComponent implements OnInit {

  /** Section links, shared by the desktop and mobile menus (numbers follow the order). */
  readonly navItems: { id: string; label: string; event: string }[] = [
    { id: 'about', label: 'Header.Item1', event: 'click_about' },
    { id: 'jobs', label: 'Header.Item2', event: 'click_experience' },
    { id: 'education', label: 'Header.Item6', event: 'click_education' },
    { id: 'soft-skills', label: 'Header.Item3', event: 'click_skills' },
    { id: 'proyects', label: 'Header.Item4', event: 'click_projects' },
  ];

  responsiveMenuVisible: boolean = false;
  pageYPosition: number;
  languageFormControl: UntypedFormControl= new UntypedFormControl();
  cvName: string = "";

  constructor(
    private router: Router,
    public analyticsService: AnalyticsService,
    public languageService: LanguageService
  ) { }

  ngOnInit(): void {

    this.languageFormControl.valueChanges.subscribe(val => this.languageService.changeLanguage(val))

    this.languageFormControl.setValue(this.languageService.language)

  }

  onNavClick(item: { id: string; event: string }): void {
    this.analyticsService.sendAnalyticEvent(item.event, 'menu', 'click');
    this.scroll(item.id);
  }

  toggleMenu(): void {
    this.responsiveMenuVisible = !this.responsiveMenuVisible;
  }

  /** Any link/button inside the mobile menu (sections, CV, language) closes it. */
  onMobileMenuClick(event: Event): void {
    const target = event.target as HTMLElement | null;
    if (target?.closest('a, button, [role="button"]')) {
      this.responsiveMenuVisible = false;
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (!this.responsiveMenuVisible) return;
    this.responsiveMenuVisible = false;
    // Return focus to the toggle so keyboard users are not left inside a hidden (inert) menu.
    (document.querySelector('.hamburger-menu') as HTMLElement | null)?.focus();
  }

  /** Brand logo: stay on the current language and go back to the top. */
  goHome(event: Event): void {
    event.preventDefault();
    this.responsiveMenuVisible = false;
    window.scrollTo({ top: 0, behavior: this.scrollBehavior() });
  }

  private scrollBehavior(): ScrollBehavior {
    return prefersReducedMotion() ? 'auto' : 'smooth';
  }

  scroll(el) {
    if(document.getElementById(el)) {
      document.getElementById(el).scrollIntoView({behavior: this.scrollBehavior()});
    } else{
      this.router.navigate(['/home']).then(()=> document.getElementById(el).scrollIntoView({behavior: this.scrollBehavior()}) );
    }
    this.responsiveMenuVisible=false;
  }

  downloadCV(){
    this.languageService.translateService.get("Header.cvName").subscribe(val => {
      this.cvName = val
      console.log(val)
      // app url
      let url = window.location.href;

      // Open a new window with the CV
      window.open(url + "/../assets/cv/" + this.cvName, "_blank");
    })

  }

  @HostListener('window:scroll', ['getScrollPosition($event)'])
    getScrollPosition(event) {
        this.pageYPosition=window.pageYOffset
    }

    changeLanguage(language: string) {
      this.languageFormControl.setValue(language);
    }
}
