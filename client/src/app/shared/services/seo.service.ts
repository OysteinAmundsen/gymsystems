import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class SEOService {

  constructor(private title: Title, private meta: Meta, @Inject(DOCUMENT) private dom: Document) { }

  setTitle(str: string, desc?: string) {
    this.createCanonicalURL();
    const title = `GymSystems${str.length ? ' | ' + str : ''}`;
    this.title.setTitle(title);
    this.meta.updateTag({ property: 'og:title', content: title });
    if (desc) {
      this.meta.updateTag({ property: 'og:description', content: desc });
      this.meta.updateTag({ property: 'Description', content: desc });
    }
  }

  createCanonicalURL(url?: string) {
    const canURL = !!url ? this.dom.URL : url;
    const link: HTMLLinkElement = this.dom.querySelector('link[rel="canonical"]') || this.dom.createElement('link');
    link.setAttribute('rel', 'canonical');
    this.dom.head.appendChild(link);
    link.setAttribute('href', canURL);
  }

}
