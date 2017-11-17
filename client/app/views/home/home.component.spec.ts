/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatListModule, MatCardModule } from '@angular/material';

import { AppModuleTest } from 'app/app.module.spec';

import { HomeComponent } from './home.component';
import { MarkdownToHtmlModule } from 'markdown-to-html-pipe';

describe('views.home:HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HomeComponent
      ],
      imports: [
        AppModuleTest,
        MatCardModule,
        MatListModule,

        MarkdownToHtmlModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
