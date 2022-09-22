// This Inbox.test.js file we are going to make some assertions about our deployed contract.
const assert = require('assert'); // Assert is a standard library that is build into the Nodejs Runtime. Assert is used for making assertions about tests. So we might assert that some value is equal to some another value.
const ganache = require('ganache-cli'); // This is going to serve our local Ethereum test network.
const Web3 = require('web3'); // Web3 is upper case unlike assert and ganache. Whenever we use Web3, we are always going to be requiring in or importing a constructor function. So this right here is a constructor. It is used to create a instance of the Web3 library. By trandition whenever we use a constructor function we always capitalize it.
const web3 = new Web3(ganache.provider()); // web3 here is lower case as we are creating instance here not a contructor.

const {abi, evm} = require('../compile');

// Mocha: It is testing framework, we can use mocha to test any type of javascript code that we want so we can use it to test front-end and back-end application too.

// Function            Purpose
// it                  Run a test and make an assertion. //assertion means we are gonna take 2 values one that our code produced and another we think the actual value we will get.
// describe            Group together 'it' functions.
// beforeEach          Execute some general setup code.

// class Car{//     park(){//         return 'stopped';//     }//     drive(){//         return 'vroom';//     }// }// let car;// beforeEach(()=>{//     car = new Car();// })// describe('CAR', ()=>{//     it('can park', ()=>{//         assert.equal(car.park(), 'stopped');//     })//     it('can drive', ()=>{//         assert.equal(car.drive(), 'vroom');//     })    // })

let accounts;
let inbox;

beforeEach(async()=>{
    // Get a list of all accounts.
    accounts = await web3.eth.getAccounts();
    // Use one of those accounts to deploy the contract.
    
    inbox = await new web3.eth.Contract(abi) // We are receiving JSON as the ABI in abi(interface) property we don't want to pass the json to create a contract that's why we are parsing(dividing) the JSON file into javascript object.
        .deploy({
            data: evm.bytecode.object, // In data property we are specifing the evm(bytecode) which is the actual raw compiled contract.
            arguments:['Hi there!'], // In this arguments array we are passing arguments to our contract Inbox and initializing initialMessage variable of Inbox contract constructor to Hi there! The values of array should be of same order as the arguments of the function. Calling deploy doesn't actually deploy a contract it just starts to create an object that can then be deployed to the network.
        })
        .send({    // It's actually the send method that triggers the communication from web3 off to the network.
            from: accounts[0], // It's the person's account that is being used to create the contract.
            gas: '1000000', // Gas is the maximum about of wei we can send with the request or the minimum. NOT SURE.
        })
})



describe('Warranty', ()=>{
    
    it('Deploys a contact', ()=>{
        assert.ok(inbox.options.address); // we have seen in console there is a object option in inbox where a address property is assigned with the address of wherever this contract deployed to. assert.ok makes an assertion whatever we are passing into the function is a value that exists. 
    })
})