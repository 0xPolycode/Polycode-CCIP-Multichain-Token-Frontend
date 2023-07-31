import { Component, OnInit } from '@angular/core';
import { PolycodeService } from '../shared/polycode.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-bridge',
  templateUrl: './bridge.component.html',
  styleUrls: ['./bridge.component.css']
})
export class BridgeComponent implements OnInit {

  itemsSub = new BehaviorSubject<string[]>([])

  selectedDestinationSub = new BehaviorSubject("Optimsim Goerli")
  selectedDestination$ = this.selectedDestinationSub.asObservable()

  selectNetworkModalVisibleSub = new BehaviorSubject(false)
  selectNetworkModalVisible$ = this.selectNetworkModalVisibleSub.asObservable()

  constructor(private pc: PolycodeService) { }

  toggleNetworkSelectModal() {
    this.selectNetworkModalVisibleSub.next(!this.selectNetworkModalVisibleSub.value)
  }

  ngOnInit(): void {
    this.pc.getTokens().then(res => {
      res.return_values[0].forEach((item: any) => {
        this.itemsSub.next(this.itemsSub.value.concat([item[0]]))
      })
    })
  }

}
