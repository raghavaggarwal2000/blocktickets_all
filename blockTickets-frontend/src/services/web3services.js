// import Web3 from 'web3'
import {priceServices} from "../api/supplier";

export const convert_in_fiat = async (price) => {
  const res = await priceServices.maticPrice();
  const inrPrice = await res.data['matic-network'].inr
  const converted = (price / (10**18)) * inrPrice
  return converted
}