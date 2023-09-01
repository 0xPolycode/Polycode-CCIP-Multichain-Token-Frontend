import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrossChainTxComponent } from './cross-chain-tx.component';

describe('CrossChainTxComponent', () => {
  let component: CrossChainTxComponent;
  let fixture: ComponentFixture<CrossChainTxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrossChainTxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrossChainTxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
