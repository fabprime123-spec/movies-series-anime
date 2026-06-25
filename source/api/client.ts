import axios from "axios"
import { TMDB_KEY } from "../constants/config"

export const tmdb = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer ${TMDB_KEY}`
  },
  params: {
    language: "en-US"
  }
})