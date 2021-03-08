import axios from "axios";
import { lolChamps } from "./constants";

export const getAllChamps = async () => {
  return axios.get(lolChamps);
};

export const getChamp = async (champName) => {
  return axios.get(
    `http://ddragon.leagueoflegends.com/cdn/11.5.1/data/en_US/champion/${champName}.json`
  );
};
export const getChampImage = (champName) => {
  return `http://ddragon.leagueoflegends.com/cdn/11.5.1/img/champion/${champName}.png`;
};
