import Web3 from "web3";
import { BLOCKCHAIN_BASE_URL } from "@env";


const getWeb3 = () => {
  const provider = new Web3.providers.HttpProvider(BLOCKCHAIN_BASE_URL);
  const web3 = new Web3(provider);
  console.log("connected...");
  return web3;
}

export default getWeb3;