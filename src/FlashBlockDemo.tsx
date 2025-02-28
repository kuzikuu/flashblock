import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

const fullBlockRPC: string = "https://sepolia.base.org";
const flashBlockRPC: string = "https://sepolia-preconf.base.org";

const providerFull = new ethers.JsonRpcProvider(fullBlockRPC);
const providerFlash = new ethers.JsonRpcProvider(flashBlockRPC);

export default function FlashBlockDemo(): JSX.Element {
  const [fullBlock, setFullBlock] = useState<number | null>(null);
  const [flashBlock, setFlashBlock] = useState<number | null>(null);
  const [diff, setDiff] = useState<number>(0);

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const full = await providerFull.getBlock("latest");
        const flash = await providerFlash.getBlock("latest");

        if (full && flash) {
          setFullBlock(full.timestamp);
          setFlashBlock(flash.timestamp);
          setDiff(flash.timestamp - full.timestamp);
        }
      } catch (error) {
        console.error("Error fetching blocks:", error);
      }
    };

    const interval = setInterval(fetchBlocks, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1 style={{ fontSize: "1.5em" }}>Base Flashblock Speed Comparison</h1>
      <h3 style={{ fontSize: "1.2em" }}>Full Block Timestamp: {fullBlock ?? "Loading..."}</h3>
      <h3 style={{ fontSize: "1.2em" }}>Flashblock Timestamp: {flashBlock ?? "Loading..."}</h3>
      <h2 style={{ fontSize: "1.5em", color: "#ff5733" }}>Speed Difference: {diff} seconds</h2>
      <p style={{ fontSize: "1em" }}>(Lower is better)</p>
    </div>
  );
}
