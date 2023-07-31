export interface Network {
    chainId: number,
    name: string,
    logoUri: string
}

export const networks: Network[] = [
    { chainId: 80001, name: 'Mumbai Matic', logoUri: 'matic.png' },
    { chainId: 420, name: 'Optimism Goerli', logoUri: 'op.png' },
    { chainId: 11155111, name: 'Ethereum Sepolia', logoUri: 'eth.png' }
]