import { ethers } from "hardhat";

async function main() {
  const Erc20 = await ethers.getContractFactory("MBJToken");
  const erc20 = await Erc20.deploy();

  await erc20.deployed();

  console.log(`ERC20 token deployed to ${erc20.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
