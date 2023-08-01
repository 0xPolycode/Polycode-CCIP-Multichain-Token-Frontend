import { Component, OnInit } from '@angular/core';
import { PolycodeService } from '../shared/polycode.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  address$ = this.pc.address$

  constructor(private pc: PolycodeService) { }

  ngOnInit(): void {
  }

  logOut() {
    this.pc.logOut()
  }

}
