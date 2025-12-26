import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VultComponents } from './vult-components';

describe('VultComponents', () => {
  let component: VultComponents;
  let fixture: ComponentFixture<VultComponents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VultComponents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VultComponents);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
