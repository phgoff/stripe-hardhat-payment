/* eslint-disable camelcase */
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { formatEther, parseEther } from "ethers/lib/utils";
import { ethers } from "hardhat";
import { Token, Token__factory, Vendor, Vendor__factory } from "../typechain";

describe("Token Contract", function () {
  // defined: 1 ether = 100 token
  const totalToken = parseEther("1000");
  const tokensPerETH = 100;
  let tokenContract: Token;
  let vendorContract: Vendor;
  let tokenAddr: string;
  let vendorAddr: string;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let vendorBalance: BigNumber;

  beforeEach(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();
    // deploy Token contract
    const Token: Token__factory = await ethers.getContractFactory("Token");
    tokenContract = await Token.deploy("TESTCOIN", "TTT", totalToken);
    await tokenContract.deployed();
    tokenAddr = tokenContract.address;

    console.log("token addr: ", tokenAddr);

    // deploy Vendor contract
    const Vender: Vendor__factory = await ethers.getContractFactory("Vendor");
    vendorContract = await Vender.deploy(tokenAddr, tokensPerETH);
    vendorAddr = vendorContract.address;

    console.log("vendor addr: ", vendorAddr);

    console.log("owner addr: ", await owner.getAddress());
  });

  it("Should transfer all token to vendor contract", async () => {
    // send all tokens to vender
    await tokenContract.transfer(vendorAddr, totalToken);

    vendorBalance = await tokenContract.balanceOf(vendorAddr);
    expect(vendorBalance).to.equal(totalToken);

    expect(await tokenContract.balanceOf(tokenAddr)).to.equal(0);
  });

  it("Should buy 1 ether and get 100 token", async () => {
    // send all tokens to vender
    await tokenContract.transfer(vendorAddr, totalToken);

    const buyAmount = parseEther("1");
    await vendorContract.connect(addr1).buy({ value: buyAmount });
    const addr1Balance = await tokenContract.balanceOf(addr1.address);
    expect(+formatEther(addr1Balance)).to.equal(tokensPerETH); // 100 token

    vendorBalance = await tokenContract.balanceOf(vendorAddr);
    expect(+formatEther(vendorBalance)).to.equal(
      +formatEther(totalToken) - tokensPerETH
    ); // available 900 token
  });

  it("Should transferFrom owner to sender via vendor contract", async () => {
    // send all tokens to vender

    // token approve for vendor
    const tx = await tokenContract.approve(vendorAddr, totalToken);
    await tx.wait();

    const ownerAddr = await owner.getAddress();
    const addr1Addr = await addr1.getAddress();
    const addr2Addr = await addr2.getAddress();

    console.log(
      "owner balance: ",
      formatEther(await tokenContract.balanceOf(ownerAddr))
    );
    console.log(
      "token balance: ",
      formatEther(await tokenContract.balanceOf(tokenAddr))
    );
    console.log(
      "vendor balance: ",
      formatEther(await tokenContract.balanceOf(vendorAddr))
    );
    console.log(
      "addr1 balance: ",
      formatEther(await tokenContract.balanceOf(addr1Addr))
    );

    console.log(
      "vendor allowance: ",
      formatEther(await tokenContract.allowance(ownerAddr, vendorAddr))
    );

    // const txFrom = await tokenContract
    //   .connect(owner)
    //   .transferFrom(ownerAddr, addr1Addr, parseEther("1"));
    const txFrom = await tokenContract.transfer(addr1Addr, parseEther("100"));

    await txFrom.wait();

    const txFrom2 = await tokenContract
      .connect(addr1)
      .transfer(addr2Addr, parseEther("10"));

    await txFrom2.wait();

    console.log("--> after transfer -->");
    console.log(
      "owner balance: ",
      formatEther(await tokenContract.balanceOf(ownerAddr))
    );
    console.log(
      "token balance: ",
      formatEther(await tokenContract.balanceOf(tokenAddr))
    );
    console.log(
      "vendor balance: ",
      formatEther(await tokenContract.balanceOf(vendorAddr))
    );
    console.log(
      "addr1 balance: ",
      formatEther(await tokenContract.balanceOf(addr1Addr))
    );
    console.log(
      "addr2 balance: ",
      formatEther(await tokenContract.balanceOf(addr2Addr))
    );
    console.log(
      "vendor allowance: ",
      formatEther(await tokenContract.allowance(ownerAddr, vendorAddr))
    );

    // await tokenContract.transfer(vendorAddr, totalToken);
  });
});
