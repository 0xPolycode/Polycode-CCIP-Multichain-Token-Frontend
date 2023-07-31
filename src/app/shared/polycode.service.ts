import { Injectable } from '@angular/core';
import { Dev3SDK } from 'dev3-sdk';
import { Contract } from 'dev3-sdk/dist/core/contracts/Contract';
import { from, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PolycodeService {

  private sdk = new Dev3SDK('jlof3.GG+hrISo/lymSlXvVnuZUy5dphbmb5nIoCCpTkS', '3c81ead8-ace2-4872-915c-4ceb6d29d43e')
  private deployer!: Contract
  private address = '0x5B81F3FF9D539acCfDb5021076122f6A55f8bd93'

  constructor() { 
    this.sdk.getContractByAlias('deployer').then(deployer => { 
      this.deployer = deployer 
    })
  }

  multichainDeploy(tokenName: string, tokenSymbol: string, salt: number, deployments: DeployData[]) {

    const data: any[] = [
      tokenName,
      tokenSymbol,
      salt,
      deployments.map(deployment => deployment.chainId),
      deployments.map(deployment => deployment.supply)
    ]
    const address: any[] = [this.address]

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

  precomputeAddress(name: string, symbol: string, salt: number) {
    return this.deployer.read('calculateAddress', [
      this.address, name, symbol, salt
    ])
  }

  getTokens() {
    return this.deployer.read('getTokens', [
      this.address
    ])
  }

}

export interface DeployData {
  chainId: string,
  supply: string
}