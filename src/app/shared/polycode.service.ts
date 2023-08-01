import { Injectable } from '@angular/core';
import { Dev3API, Dev3SDK } from 'dev3-sdk';
import { ContractCallAction } from 'dev3-sdk/dist/core/actions/ContractCallAction';
import { Contract } from 'dev3-sdk/dist/core/contracts/Contract';
import { BehaviorSubject, from, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PolycodeService {

  private WALLET_STORAGE_KEY = 'multichain-token.polycode.wallet-storage'

  private sdk = new Dev3SDK('jlof3.GG+hrISo/lymSlXvVnuZUy5dphbmb5nIoCCpTkS', '3c81ead8-ace2-4872-915c-4ceb6d29d43e')
  private deployer!: Contract
  // private addressSub = new BehaviorSubject<string | null>('0x5B81F3FF9D539acCfDb5021076122f6A55f8bd93')
  private addressSub = new BehaviorSubject<string | null>(null)

  address$ = this.addressSub.asObservable()

  constructor() { 
    this.sdk.getContractByAlias('deployer').then(deployer => { 
      this.deployer = deployer 
    })
    const address = localStorage.getItem(this.WALLET_STORAGE_KEY)
    if(address) {
      this.addressSub.next(address)
    }
  }

  authWallet() {
    this.sdk.authorizeWallet({}).then(res => {
      res.present().then(user => {
        if(user?.wallet) {
          this.addressSub.next(user.wallet)
          localStorage.setItem(this.WALLET_STORAGE_KEY, user.wallet)
        }
      })
    })
  }

  logOut() {
    localStorage.removeItem(this.WALLET_STORAGE_KEY)
    this.addressSub.next(null)
  }

  multichainDeploy(tokenName: string, tokenSymbol: string, salt: number, deployments: DeployData[]) {

    const data: any[] = [
      tokenName,
      tokenSymbol,
      salt,
      deployments.map(deployment => deployment.chainId),
      deployments.map(deployment => deployment.supply)
    ]
    const address: any[] = [this.addressSub.value]

    return from(this.deployer.read('getBatchDeployFee', 
      address.concat(data)
    )).pipe(
      switchMap(fee => {
        return from(this.deployer.buildAction('batchDeploy', data, {
          ethAmount: fee.return_values[0] }))
      }),
      switchMap(action => from(action.present()))
    )
  }

  async bridgeToken(tokenAddress: string, chainId: number, amount: number) {

    // Arbitrary read, get bridge fee for token 0x902F1Aa951a3f826f6295aF5aCb8602C42D4d19f
    const readResult = await Dev3API.instance().readContract({
      contract_address: tokenAddress,
      function_name: "getBridgeFee",
      function_params: [
        { type: "uint256", value: chainId.toString() }, // to chani id (sepolia)
        { type: "address", value: this.addressSub.value! }, // who's bridging?
        { type: "uint256", value: amount.toString() } // how much is bridging?
      ],
      output_params: ["uint256"],
      caller_address: "0x0000000000000000000000000000000000000000"
    });

    const feeInWei = readResult.return_values[0];
  
    // Arbitrary write, create bridge tx request and open widget
    const bridgeAction = await Dev3API.instance().createFunctionCallRequest({
      contract_address: tokenAddress,
      function_name: "bridge",
      function_params: [
        { type: "uint256", value: chainId.toString() }, // to chani id (sepolia)
        { type: "uint256", value: amount.toString() } // how much is bridging?
      ],
      eth_amount: feeInWei // important, fee in wei from read before
    });
  
    // present widget and process the transaction
    const bridgeActionResult = await this.sdk.present(bridgeAction.redirect_url);

    return bridgeActionResult as ContractCallAction
  }
  

  precomputeAddress(name: string, symbol: string, salt: number) {
    return this.deployer.read('calculateAddress', [
      this.addressSub.value, name, symbol, salt
    ])
  }

  getTokens() {
    return this.deployer.read('getTokens', [
      this.addressSub.value
    ])
  }

}

export interface DeployData {
  chainId: string,
  supply: string
}