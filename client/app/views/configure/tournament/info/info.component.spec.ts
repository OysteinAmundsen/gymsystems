import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { InfoComponent } from './info.component';
import { SharedModule } from 'app/shared/shared.module';
import { HttpModule } from '@angular/http';
import { ConfigurationService, TournamentService } from 'app/services/api';

describe('InfoComponent', () => {
  let component: InfoComponent;
  let fixture: ComponentFixture<InfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        RouterTestingModule,
        HttpModule
      ],
      declarations: [ InfoComponent ],
      providers: [
        ConfigurationService,
        TournamentService,
        {
          provide: ActivatedRoute, useValue: {
            parent: {
              params: Observable.of({ id: 1 })
            }
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
