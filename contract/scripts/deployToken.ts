/* eslint-disable camelcase */
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import fs from "fs";
import path from "path";
import { ethers, artifacts } from "hardhat";
import { Token__factory, Vendor__factory } from "../typechain";
import { formatEther, parseEther } from "ethers/lib/utils";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const totalToken = parseEther("100000");
  const tokensPerETH = 100;

  const [owner] = await ethers.getSigners();

  const Token: Token__factory = await ethers.getContractFactory("Token", owner);
  const tokenContract = await Token.deploy("MYTOKEN", "MTK", totalToken);
  await tokenContract.deployed();
  const tokenAddr = tokenContract.address;

  const Vendor: Vendor__factory = await ethers.getContractFactory("Vendor");
  const vendorContract = await Vendor.deploy(tokenAddr, tokensPerETH);

  await vendorContract.deployed();
  const vendorAddr = vendorContract.address;

  await tokenContract.transfer(vendorAddr, totalToken.div(2));

  const bal1 = await tokenContract.balanceOf(await owner.getAddress());
  const bal2 = await tokenContract.balanceOf(vendorAddr);
  console.log("a1", await owner.getAddress());
  console.log("bal1", formatEther(bal1));
  console.log("bal2", formatEther(bal2));

  saveContract(tokenAddr, "Token");
  saveContract(vendorAddr, "Vendor");

  console.log("Token deployed to:", tokenAddr);
  console.log("Vendor deployed to:", vendorAddr);
}

// save contract detail to frontend
function saveContract(contractAddr: string, name: string) {
  const filePath = path.join(__dirname, "../../frontend/src/contracts/", name);
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(filePath);
  }

  fs.writeFileSync(
    `${filePath}/address.json`,
    JSON.stringify(
      {
        address: contractAddr,
      },
      null,
      2
    )
  );
  fs.writeFileSync(
    `${filePath}/abi.json`,
    JSON.stringify(artifacts.readArtifactSync(name), null, 2)
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
