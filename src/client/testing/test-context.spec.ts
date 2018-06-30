import {DebugElement, Type} from '@angular/core';
import {async, ComponentFixture, TestBed, TestModuleMetadata} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

/**
 * Nicked from https://github.com/youdz/dry-angular-testing
 */
export class TestContext<T, H> {
  fixture: ComponentFixture<H>;
  hostComponent: H;
  tested: DebugElement;
  testedDirective: T;
  testedElement: any;

  /*
   * Add any shortcuts you may need.
   * Here is an example of one, but you could for instance add shortcuts to:
   * - query native elements directly by CSS selector
   * - request providers from the tested directive's injector
   * - ...
   */
  detectChanges() {
    this.fixture.detectChanges();
  }
}

export function initContext<T, H>(testedType: Type<T>, hostType: Type<H>, moduleMetadata: TestModuleMetadata = {}) {
  beforeEach(function() {
    /*
     * I feel dirty writing this, but Jasmine creates plain objects
     * and modifying their prototype is definitely a bad idea
     */
    Object.assign(this, TestContext.prototype);
  });

  beforeEach(async(function(this: TestContext<T, H>) {
    const declarations = [ testedType, hostType ];
    if (moduleMetadata && moduleMetadata.declarations) {
      declarations.push(...moduleMetadata.declarations);
    }
    TestBed.configureTestingModule({...moduleMetadata, declarations: declarations})
      .compileComponents();
  }));

  beforeEach(function(this: TestContext<T, H>) {
    this.fixture = TestBed.createComponent(hostType);
    this.fixture.detectChanges();
    this.hostComponent = this.fixture.componentInstance;
    const testedDebugElement = this.fixture.debugElement.query(By.directive(testedType));
    // On larger project, it would be recommended to throw an error here if the tested directive can't be found.
    this.tested = testedDebugElement;
    this.testedDirective = testedDebugElement.injector.get(testedType);
    this.testedElement = testedDebugElement.nativeElement;
  });

  afterEach(function(this: TestContext<T, H>) {
    if (this.fixture) {
      this.fixture.destroy();
      this.fixture.nativeElement.remove();
    }
  });
}
