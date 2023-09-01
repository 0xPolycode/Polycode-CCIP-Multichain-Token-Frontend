import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Network } from '../shared/networks';
import { PolycodeService } from '../shared/polycode.service';
import { FormControl } from '@angular/forms';
import { arrayify } from 'ethers/lib/utils';

@Component({
  selector: 'app-cross-chain-tx',
  templateUrl: './cross-chain-tx.component.html',
  styleUrls: ['./cross-chain-tx.component.css']
})
export class CrossChainTxComponent implements OnInit {


  amountSend = new FormControl('')
  amountReceive = new FormControl('')

  chains: Network[] = [
    {
      chainId: 11155111,
      logoUri: 'eth.png',
      name: 'Ethereum Sepolia'
    },
    {
      chainId: 420,
      logoUri: 'op.png',
      name: 'Optimism Goerli'
    }
  ]

  selectedChainSub = new BehaviorSubject<Network>(this.chains[0])
  selectedChain$ = this.selectedChainSub.asObservable()

  selectChainVisibleSub = new BehaviorSubject(false)
  selectChainVisible$ = this.selectChainVisibleSub.asObservable()

  hashSub = new BehaviorSubject<string | undefined>("")
  hash$ = this.hashSub.asObservable()

  constructor(private ps: PolycodeService) { }

  ngOnInit(): void {
  }

  

  performCrossChainSwap() {
    this.ps.rtc(
      "0x114CF2089c88D64Ae9c3FDc90E8fD568E79B9681",
      420,
      0,
      "0x0000000000000000000000000000000000000000",
      BigInt("1000000000000000000"),
      "0x8d2915D89912Ba7bfBe2a5EA20BE6A1BBea7DB94",
      arrayify("0x38ed17390000000000000000000000000000000000000000000000000de0b6b3a7640000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000072aed714af254414ebe14949310738cb60a607900000000000000000000000000000000000000000000000000000000064fd01fa0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000114cf2089c88d64ae9c3fdc90e8fd568e79b9681000000000000000000000000fc50147680cceca0050123d0cd4304f35fcf7e5c"),
      2000000,
      true
    ).then(res => {
      this.hashSub.next(res.transactionHash)
    })

  }

  toggleSelectChainVisibility() {
    this.selectChainVisibleSub.next(!this.selectChainVisibleSub.value)
  }

  selectChain(index: number) {
    this.selectedChainSub.next(this.chains[index])
    this.toggleSelectChainVisibility()
  }

}