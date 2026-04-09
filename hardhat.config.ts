import { defineConfig } from "hardhat/config";
import hardhatToolboxMochaEthers from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import dotenv from "dotenv";

dotenv.config();

const AMOY_RPC_URL = process.env.AMOY_RPC_URL || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

export default defineConfig({
  solidity: {
    version: "0.8.20",
  },
  networks: {
    localhost8546: {
      type: "http",
      url: "http://127.0.0.1:8546",
    },
    amoy: {
      type: "http",
      url: AMOY_RPC_URL,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
  plugins: [hardhatToolboxMochaEthers],
});
