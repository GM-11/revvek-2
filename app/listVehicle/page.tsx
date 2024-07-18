"use client";

import { getProvider, getSigner, vehicleData, getAddress } from "@/utils/utils";
import axios from "axios";
import "./page.css";
import { Contract } from "ethers";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { SellerType } from "@/utils/types";

function Home() {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [price, setPrice] = useState(0);
  const [address, setAddress] = useState("");
  const [sellerType, setSellerType] = useState<SellerType>();
  const [message, setMessage] = useState("");

  function generateId(): number {
    const min = 10000000;
    const max = 99999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function handleBrandChange(event: React.ChangeEvent<HTMLInputElement>) {
    setBrand(event.target.value);
  }

  function handleModelChange(event: React.ChangeEvent<HTMLInputElement>) {
    setModel(event.target.value);
  }

  function handlePriceChange(event: React.ChangeEvent<HTMLInputElement>) {
    setPrice(parseInt(event.target.value));
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      setImage(event.target.files[0]);
    }
  }

  useEffect(() => {
    async function load() {
      const address = await getAddress();

      window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0xaa36a7",
            rpcUrls: [
              "https://eth-sepolia.g.alchemy.com/v2/MvHvfT5YNsOuQ9qP6guB3qeiDbdpOjUc",
            ],
            chainName: "Ethereum Sepolia",
            nativeCurrency: {
              name: "ETH",
              symbol: "ETH",
              decimals: 18,
            },
            // blockExplorerUrls: ["https://polygonscan.com/"],
          },
        ],
      });
      setAddress(address);
    }
    load();
  }, []);

  async function submit() {
    const signer = await getSigner();

    if (image) {
      try {
        setMessage("Uploading... Please wait");
        const formData = new FormData();
        formData.append("file", image);

        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: `${process.env.NEXT_PUBLIC_PINATA_API_KEY}`,
            pinata_secret_api_key: `${process.env.NEXT_PUBLIC_SECRET_KEY}`,
            "Content-Type": "multipart/form-data",
          },
        });

        const ImgHash = `https://ipfs.io/ipfs/${resFile.data.IpfsHash}`;
        console.log(ImgHash);

        const contract = new Contract(
          vehicleData.address,
          vehicleData.abi,
          signer
        );
        const id = generateId();

        const result = await contract.createVehicle(
          brand,
          model,
          BigInt(price),
          BigInt(id),
          sellerType === SellerType.Direct ? BigInt(1) : BigInt(2),
          ImgHash
        );
        await result.wait();
        setMessage("Vehicle added successfully");
      } catch (error) {
        console.log("Error sending File to IPFS: ");
        console.log(error);
      }
    }
  }

  return (
    <div className="main">
      <Navbar address={address} />

      {message === "" ? (
        <></>
      ) : (
        <div className="message">
          <h1>{message}</h1>
        </div>
      )}

      <section>
        <div className="data">
          <input
            placeholder="Brand"
            type="text"
            // value={brand}
            onChange={handleBrandChange}
          />
          <br />
          <input
            placeholder="Model"
            type="text"
            // value={model}
            onChange={handleModelChange}
          />
          <br />
          <input
            placeholder="Price"
            type="number"
            onChange={handlePriceChange}
          />
          <br />
          <div className="labels">
            <label htmlFor="manf">
              Manufacturer
              <input
                id="manf"
                type="radio"
                checked={sellerType === SellerType.Direct}
                onChange={() => {
                  setSellerType(SellerType.Direct);
                }}
                value={SellerType.Direct}
              />
            </label>
            <label htmlFor="manf">
              Resel
              <input
                id="manf"
                type="radio"
                checked={sellerType === SellerType.Resell}
                onChange={() => {
                  setSellerType(SellerType.Resell);
                }}
                value={SellerType.Resell}
              />
            </label>
          </div>
          <br />
          <input type="file" accept="image/*" onChange={handleImageChange} />
          <button onClick={submit}>Submit</button>
        </div>
        <div className="img-box">
          {image && (
            <Image
              src={URL.createObjectURL(image!)}
              alt="Loading"
              className="img"
              width={600}
              height={350}
            />
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;
