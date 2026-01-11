import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { Catalogo } from './catalogo.component';
import { PropiedadService } from '../../core/services/propiedad.service';

describe('Catalogo', () => {
  let component: Catalogo;
  let fixture: ComponentFixture<Catalogo>;

  const propSrvMock = {
    listarCatalogo: () => of([]),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Catalogo],
      providers: [{ provide: PropiedadService, useValue: propSrvMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(Catalogo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
