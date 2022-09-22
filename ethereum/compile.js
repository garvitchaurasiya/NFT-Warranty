const path = require('path');
const fs = require('fs');

const solc = require('solc');

const inboxPath = path.resolve(__dirname, 'contracts', 'Warranty.sol');

const source = fs.readFileSync(inboxPath, 'utf-8');


const input = {
    language: 'Solidity',
    sources: {
      'Warranty.sol': {
        content: source,
      },
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*'],
        },
      },
    },
  };

// --version 0.4.17 module.exports = solc.compile(source, 1).contracts[':Inbox']; // This is exporting 2 properties one is bytecode which is the actual raw compiled contract and another is interface which is the javascript ABI.
console.log(JSON.parse(solc.compile(JSON.stringify(input))));
module.exports = JSON.parse(solc.compile(JSON.stringify(input))).contracts['Warranty.sol'].Warranty;
  