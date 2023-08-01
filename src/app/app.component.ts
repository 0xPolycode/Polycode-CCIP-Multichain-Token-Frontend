import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PolycodeService } from './shared/polycode.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'multichain-token';

  address$ = this.pc.address$

  constructor(private pc: PolycodeService) {}

  authWallets() {
    this.pc.authWallet()
  }

}
