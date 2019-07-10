import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class SEOService {

  constructor(private title: Title, private meta: Meta, @Inject(DOCUMENT) private dom: Document) { }

  setTitle(str: string, desc?: string) {
    const title = `GymSystems${str.length ? ' | ' + str : ''}`;

    // Set title
    this.title.setTitle(title);
    this.meta.updateTag({ property: 'twitter:card', content: 'summary' });
    this.meta.updateTag({ property: 'twitter:site', content: 'gymsystems.no' });
    this.meta.updateTag({ property: 'og:title', content: title });

    // Set url
    const url = this.createCanonicalURL();
    this.meta.updateTag({ property: 'og:url', content: url });

    // Set description
    if (desc) {
      this.meta.updateTag({ property: 'og:description', content: desc });
      this.meta.updateTag({ property: 'Description', content: desc });
    }
  }

  createCanonicalURL(url?: string) {
    const canURL = !!url ? url : this.dom.URL;
    const link: HTMLLinkElement = this.dom.querySelector('link[rel="canonical"]') || this.dom.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', canURL);
    this.dom.head.appendChild(link);
    return canURL;
  }

}
