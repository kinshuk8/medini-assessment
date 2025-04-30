import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiUsersComponent } from './api-users.component';

describe('ApiUsersComponent', () => {
  let component: ApiUsersComponent;
  let fixture: ComponentFixture<ApiUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApiUsersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApiUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
