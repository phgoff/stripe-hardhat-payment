// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers, artifacts } from "hardhat";
import fs from "fs";
import { Greeter } from "../typechain";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const Greeter = await ethers.getContractFactory("Greeter");
  const greeter = await Greeter.deploy("Hello, Hardhat!");

  await greeter.deployed();

  console.log(await greeter.greet());

  saveContract(greeter);

  console.log("Greeter deployed to:", greeter.address);
}

// save contract detail to frontend
function saveContract(greeter: Greeter) {
  // eslint-disable-next-line node/no-path-concat
  const path = __dirname + "/../frontend/src/contracts";
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }

  fs.writeFileSync(
    `${path}/address.json`,
    JSON.stringify(
      {
        address: greeter.address,
      },
      null,
      2
    )
  );
  fs.writeFileSync(
    `${path}/abi.json`,
    JSON.stringify(artifacts.readArtifactSync("Greeter"), null, 2)
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
