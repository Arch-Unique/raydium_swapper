import RaydiumSwap from './RaydiumSwap'
import { VersionedTransaction, LAMPORTS_PER_SOL } from '@solana/web3.js'

const swap = async (amount: number,walletPrivateKey: string,tokenToSellOrBuy: string,shouldSell: boolean) => {
  const tokenAAmount = amount // e.g. 0.01 SOL -> B_TOKEN

  const baseMint = 'So11111111111111111111111111111111111111112' // e.g. SOLANA mint address
  const quoteMint = tokenToSellOrBuy

  const raydiumSwap = new RaydiumSwap("https://api.mainnet-beta.solana.com", walletPrivateKey)
  console.log(`Raydium swap initialized`)

  // Loading with pool keys from https://api.raydium.io/v2/sdk/liquidity/mainnet.json
  await raydiumSwap.loadPoolKeys()
  console.log(`Loaded pool keys`)

  // Trying to find pool info in the json we loaded earlier and by comparing baseMint and tokenBAddress
  let poolInfo = raydiumSwap.findPoolInfoForTokens(baseMint, quoteMint)

  if (!poolInfo) poolInfo = await raydiumSwap.findRaydiumPoolInfo(baseMint, quoteMint)

  if (!poolInfo) {
    throw new Error("Couldn't find the pool info")
  }

  console.log('Found pool info', poolInfo)

  const tx = await raydiumSwap.getSwapTransaction(
    shouldSell ? baseMint : quoteMint,
    tokenAAmount,
    poolInfo,
    0.0005 * LAMPORTS_PER_SOL, // Prioritization fee, now set to (0.0005 SOL)
    'in',
    5 // Slippage
  )

  const txid = await raydiumSwap.sendVersionedTransaction(tx as VersionedTransaction)
    console.log(`https://solscan.io/tx/${txid}`)
}


// Buy Token e.g Buy 1000 DOGS 
// swap(1000,"walletprivateKey","TokenAddressOfDOGS",false);

// Sell Token e.g Sell 1000 DOGS 
// swap(1000,"walletprivateKey","TokenAddressOfDOGS",true);