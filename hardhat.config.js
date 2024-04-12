
/* global ethers task */
require('@nomiclabs/hardhat-waffle')

// This is a sample Hardhat task. To learn how to create your own go to

task('accounts', 'Prints the list of accounts', async () => {
  const accounts = await ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address)
  }
})

// You need to export an object to set up your config
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: '0.8.17',
  settings: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
    networks: {
    
    ganache: {
      url: "HTTP://127.0.0.1:7545",
      accounts: ['0xa8e9aa87ee430950e906de74b75dd03bb7da20c7d6118d5efad467a185436acf', '0xd67460fd15ea87e041daec427378517174b1af247a06310c14e07afd6322356d', '0x53d3fe202f914a69ec77307767f2131d8743d2a205efc3288dc598cd025b07e7'],
      timeout: 600000
    }  
    
  },
}
