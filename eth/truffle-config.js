const HDWalletProvider = require('truffle-hdwallet-provider');

const fs = require('fs');
const infuraKey = fs.readFileSync(".infuraKey").toString().trim();
const mnemonic = fs.readFileSync(".secret").toString().trim();

module.exports = {
  // Uncommenting the defaults below 
  // provides for an easier quick-start with Ganache.
  // You can also follow this format for other networks;
  // see <http://truffleframework.com/docs/advanced/configuration>
  // for more details on how to specify configuration options!
  //
networks: {
  // local development (ganache-cli)
  development: {
    host: "127.0.0.1",
    port: 8545,
    network_id: "*"
  },

  // rinkeby testnet
  rinkeby: {
    provider: () => new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/${infuraKey}`),
    network_id: 4,
    gas: 4500000,
    gasPrice: 10000000000,
    confirmations: 2
  },
 },
  //
  // Truffle DB is currently disabled by default; to enable it, change enabled:
  // false to enabled: true. The default storage location can also be
  // overridden by specifying the adapter settings, as shown in the commented code below.
  //
  // NOTE: It is not possible to migrate your contracts to truffle DB and you should
  // make a backup of your artifacts to a safe location before enabling this feature.
  //
  // After you backed up your artifacts you can utilize db by running migrate as follows: 
  // $ truffle migrate --reset --compile-all
  //
  // db: {
    // enabled: false,
    // host: "127.0.0.1",
    // adapter: {
    //   name: "sqlite",
    //   settings: {
    //     directory: ".db"
    //   }
    // }
  // }

  // specify solidity compiler version
  compilers: {
    solc: {
      version: "0.8.10"
    }
  },

  // specify timeout for tests (2 seconds default might not be enough)
  mocha: {
    timeout: 5000 // 5s
  },
};
