//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Token.sol";

contract Vendor {
    Token token;
    uint public tokensPerEth;

    constructor(address _tokenAddress, uint _tokensPerETH) {
        token = Token(_tokenAddress);
        tokensPerEth = _tokensPerETH;
    }

    function buy() public payable returns (uint) {
        require(msg.value > 0, "Not enough ether");
        uint buyAmount = msg.value * tokensPerEth;
        uint vendorBalance = token.balanceOf(address(this));

        require(vendorBalance >= buyAmount, "Not enough liquidity");

        token.transfer(msg.sender, buyAmount);

        return buyAmount;
    }
}