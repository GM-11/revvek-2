"use client";

import React, { useState, useEffect } from "react";
import { ethers, BrowserProvider, Contract } from "ethers";
import dotenv from "dotenv";
import Image from "next/image";
import "./page.css";
import VehicleDataABI from "../artifacts/contracts/VehicleData.sol/VehicleData.json";

import {
  getAddress,
  getProvider,
  getSigner,
  vecFT,
  vehicleData,
} from "../utils/utils";
import Link from "next/link";
import { log } from "console";
import { VehicleData } from "../utils/types";
import { SellerType } from "@/utils/types";
import Navbar from "@/components/Navbar";

dotenv.config();

function Home() {
  const [provider, setProvider] = useState<BrowserProvider>();
  const [address, setAddress] = useState("");
  const [signer, setSigner] = useState<ethers.Signer>();
  const [allVehicles, setAllVehicles] = useState([] as VehicleData[]);

  async function load() {
    const provider = await getProvider();
    const signer = await getSigner();
    const address = await getAddress();

    setProvider(provider);
    setSigner(signer);
    setAddress(address);
    getAllVehicles();
  }

  useEffect(() => {
    async function load() {
      const provider = await getProvider();
      const signer = await getSigner();
      const address = await getAddress();

      setProvider(provider);
      setSigner(signer);
      setAddress(address);
      getAllVehicles();
    }
    load();
  }, []);

  async function getAllVehicles() {
    const provider = await getProvider();
    const contract = new Contract(
      vehicleData.address,
      VehicleDataABI.abi,
      provider
    );
    const result = await contract.getAllVehicles();
    console.log(result.length);

    let vehicles: VehicleData[] = [];
    for (let index = 0; index < result.length; index++) {
      const element = result[index];

      const vehicle = {
        id: element[0],
        brand: element[1],
        model: element[2],
        imageLink: element[6],
        price: parseInt(element[3]),
        sellerType: parseInt(element[4]) as SellerType,
        owner: element[5],
        listed: element[7],
      } as VehicleData;

      vehicles.push(vehicle);
    }
    setAllVehicles(vehicles);
  }

  return (
    <>
      <div className="main">
        <>
          {address === "" ? (
            <button onClick={load}>Connect Wallet</button>
          ) : (
            <>
              <Navbar address={address} />

              <div className="body">
                <h1>
                  Buy and sell vehicles <br /> with trust
                </h1>

                <br />

                <div className="divider">{""}</div>
                <div className="listings">
                  <div className="listing-header">
                    <h2>Listed Vehicles</h2>
                    <Link className="do-list" href={"/listVehicle"}>
                      <h2>List vehicle</h2>
                    </Link>
                  </div>
                  <div className="listing-grid">
                    {allVehicles.length > 0 ? (
                      <>
                        {allVehicles.map(function (v) {
                          if (v.listed) {
                            return (
                              <Link
                                className="link"
                                href={`/getVehicle/${v.id}`}
                                key={v.id}
                              >
                                <Image
                                  className="img"
                                  src={v.imageLink}
                                  alt="Loading"
                                  width={300}
                                  height={200}
                                />
                                <h3>{v.brand}</h3>
                                <h4>{v.model}</h4>
                              </Link>
                            );
                          }
                        })}
                      </>
                    ) : (
                      <>
                        <h3>No Vehicles Listed</h3>
                      </>
                    )}
                  </div>
                </div>
                <br />
              </div>
            </>
          )}
        </>
      </div>
    </>
  );
}

export default Home;
