"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Contract, ethers } from "ethers";
import "./page.css";
import {
  getAddress,
  getProvider,
  getSigner,
  vecFT,
  vehicleData,
} from "@/utils/utils";
import Image from "next/image";
import axios from "axios";
import { SellerType, VehicleData } from "@/utils/types";
import Navbar from "@/components/Navbar";

function Home() {
  const params = useParams();

  const [vehicle, setVehicle] = useState<VehicleData>();
  const [address, setAddress] = useState("");

  const [message1, setMessage1] = useState("");
  const [message2, setMessage2] = useState("");

  useEffect(() => {
    async function load() {
      const address = await getAddress();
      setAddress(address);
    }
    load();
  }, []);

  const loadVehicle = useCallback(
    async function () {
      const provider = await getProvider();
      const contract = new Contract(
        vehicleData.address,
        vehicleData.abi,
        provider
      );
      const element = await contract.getVehicle(params.vehicleID);
      const vehicle = {
        id: element[0],
        brand: element[1],
        model: element[2],
        imageLink: element[6],
        price: parseInt(element[3]) + 0.003,
        sellerType: parseInt(element[4]) as SellerType,
        owner: element[5],
      } as VehicleData;

      console.log(vehicle);
      setVehicle(vehicle);
    },
    [params.vehicleID]
  );
  useEffect(() => {
    loadVehicle();
  }, [loadVehicle]);

  async function buy(vehicle: VehicleData) {
    const address = await getAddress();
    const signer = await getSigner();

    setMessage1("Purchase in progress... Please wait");
    setMessage2("This may take some time");
    const metadata = JSON.stringify({
      name: vehicle.brand,
      model: vehicle.model,
      image: vehicle.imageLink,
      price: vehicle.price,
      owner: address,
    });

    try {
      const formData = new FormData();

      formData.append("pinataMetadata", metadata);

      const uploadMetadata = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        data: metadata,
        headers: {
          pinata_api_key: `8e47753f1e470dbd3e27`,
          pinata_secret_api_key: `c48e999098cb1f5f123744bb05125966b08980b6c3d4e8f3662955c60f866e82`,
          "Content-Type": "application/json",
        },
      });

      const metadataHash = uploadMetadata.data.IpfsHash;
      console.log(metadataHash);

      const vecftContract = new Contract(vecFT.address, vecFT.abi, signer);

      const vecftResult = await vecftContract.safeMint(
        address,
        `https://ipfs.io/ipfs/${metadataHash}`
      );

      const contract = new Contract(
        vehicleData.address,
        vehicleData.abi,
        signer
      );

      const result = await contract.buyVehicle(BigInt(vehicle.id), {
        value: ethers.parseEther(`${vehicle.price}`),
      });

      // const tx = await signer?.sendTransaction({
      //   from: address,
      //   to: vehicle.owner,
      //   value: ethers.parseEther("0.0003"),
      // });

      await vecftResult.wait();
      await result.wait();
      console.log(vecftResult.hash);
      console.log(result);

      setMessage1(`NFT Transastion Hash: ${vecftResult.hash} `);
      setMessage2("Please import this NFT in your wallet to view the vehicle");
    } catch (error) {
      console.error(error);
    }
  }

  if (vehicle) {
    return (
      <div className="main">
        {message1 === "" ? (
          <></>
        ) : (
          <div className="message">
            <h3>{message1}</h3>
            <p>{message2}</p>
          </div>
        )}
        <Navbar address={address} />
        <div className="b">
          <div className="img-cont">
            <Image
              className="img"
              src={vehicle.imageLink}
              alt="Picture of the vehicle"
              width={600}
              height={400}
            />
          </div>
          <div className="content">
            <h2>
              Price: <strong>{vehicle.price}</strong> MATIC
            </h2>
            <br />
            <p>
              {vehicle.sellerType === SellerType.Direct
                ? "Directly from Manufacturer"
                : "Resell"}
            </p>
            <br />
            <p>Seller: {vehicle.owner}</p>
            <br />
            <button onClick={() => buy(vehicle)}>BUY</button>
          </div>
        </div>{" "}
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
}

export default Home;
