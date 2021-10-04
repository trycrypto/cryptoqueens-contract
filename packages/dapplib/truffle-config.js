require('@babel/register');
({
    ignore: /node_modules/
});
require('@babel/polyfill');

const HDWalletProvider = require('@truffle/hdwallet-provider');

let mnemonic = 'hope area off tragic educate ranch remind concert grace nature suit slice'; 
let testAccounts = [
"0x917787de1be0ce0cc0d355b92a4e88217284b4843a39f1510e5bfffbaba60310",
"0xb5782ccbc3c522094c5bb4283e9e981225c19418a36e2ad57ac362f01e111aad",
"0xd4ffc15a03c3bb8f686e6a9d899e6ce9d422b75bddcd8288e6ddef0ab7664118",
"0x88fe3178f09f30d051ea04fd727e5f7f61c2bfb8553dcf4ea7008d3b0a0d7195",
"0xee5c9897576ea0e5bffcb1a51019715f827b90949721eebce043c63ee337038e",
"0xe2ca2158feccbc95678a5d248ef535b0ac7519db98e59d4363f77a743b81001d",
"0x15581aef9b5b621a5d9114536cf15ff7ad469ff88b6be07f06b07db85fc9f69d",
"0xb637088b424dc0c7a11414a03f580ed814bdb537a41f39a2033e6e3624b9f6e4",
"0x8df87ff804983f382408a136ee79110954fc4b682ad2bc89b3c41a2e00b0c036",
"0xe4c96395a58309d6cd362eb35a243208a853ce7978af4466a6d35aaf7fb446a8"
]; 
let devUri = 'http://127.0.0.1:7545/';

module.exports = {
    testAccounts,
    mnemonic,
    networks: {
        development: {
            uri: devUri,
            provider: () => new HDWalletProvider(
                mnemonic,
                devUri, // provider url
                0, // address index
                10, // number of addresses
                true, // share nonce
                `m/44'/60'/0'/0/` // wallet HD path
            ),
            network_id: '*'
        }
    },
    compilers: {
        solc: {
            version: '^0.8.0'
        }
    }
};

