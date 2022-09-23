import web3 from './web3';
import CompiledWarranty from './build/Warranty.json';

// This file is created because anytime we want to tell web3 about a already deployed contract, we have to give web3 that contract's interface or abi. And abi is defined in the CollegeRating.json file after we compile our ethereum directory

const instance = new web3.eth.Contract( // This is our contract instance which refers to a particular address.
	CompiledWarranty.abi,
    '0x4554B3Aa81DE2BDA265AA4C4828D20744958BC04'
);

export default instance;