import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeployComponent } from './deploy/deploy.component';
import { BridgeComponent } from './bridge/bridge.component';
import { CrossChainTxComponent } from './cross-chain-tx/cross-chain-tx.component';

const routes: Routes = [
  { path: '', component: DeployComponent },
  { path: 'deploy', component: DeployComponent },
  { path: 'bridge', component: BridgeComponent },
  { path: 'cctx', component: CrossChainTxComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
