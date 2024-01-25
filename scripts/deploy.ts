const { ethers } = require("hardhat");

async function main() {
  const vehicleData = await ethers.deployContract("VehicleData");
  console.log("VehicleData deployed to: ", await vehicleData.getAddress());

  const vecFT = await ethers.deployContract("VecFT");
  console.log("VecFT deployed to: ", await vecFT.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
