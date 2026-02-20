import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { HttpClient } from "@angular/common/http";

export const SkillsResolver: ResolveFn<string[]> = () => {
    const httpClient = inject(HttpClient);
    return httpClient.get<string[]>('/assets/i18n/en.json');
}