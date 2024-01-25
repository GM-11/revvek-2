import { BrowserProvider } from "ethers";

// import VehicleDataABI from "../artifacts/contracts/VehicleData.sol/VehicleData.json";
// import VecFTABI from "../artifacts/contracts/VecFT.sol/VecFT.json";

import VehicleData from "./VehicleData.json";
import VecFT from "./VecFT.json";
const vehicleData = {
  address: "0xabDbA0F0F2Fc6BF6Db0FF0dEd3331DDa1084D63D",
  abi: VehicleData.abi,
};

const vecFT = {
  address: "0x796B070eE07F3224Ef964b4917F9EAb697e22e80",
  abi: VecFT.abi,
};

async function getProvider() {
  const provider = new BrowserProvider(window.ethereum);
  if (!provider) {
    console.log("Please install Metamask or any other wallet!");
    return;
  }

  return provider;
}

async function getSigner() {
  const provider = await getProvider();
  if (!provider) {
    console.log("Please install Metamask or any other wallet!");
    return;
  }

  return provider.getSigner();
}

async function getAddress() {
  if (!window.ethereum) {
    console.log("Please install Metamask or any other wallet!");
    return;
  }
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  return accounts[0];
}

export { getProvider, getSigner, getAddress, vehicleData, vecFT };
