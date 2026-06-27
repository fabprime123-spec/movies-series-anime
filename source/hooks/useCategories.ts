import { useQuery } from "@tanstack/react-query";

import {
  getAnime,
  getDocumentaries,
  getKDrama,
  getCDrama,
  getJDrama,
  getAsianDrama
} from "../api/category.api";


export function useAnime() {

  return useQuery({

    queryKey: ["anime"],

    queryFn: getAnime

  })

}



export function useDocumentary() {

  return useQuery({

    queryKey: ["documentary"],

    queryFn: getDocumentaries

  })

}



export function useKDrama() {

  return useQuery({

    queryKey: ["kdrama"],

    queryFn: getKDrama

  })

}



export function useCDrama() {

  return useQuery({

    queryKey: ["cdrama"],

    queryFn: getCDrama

  })

}

export function useJDrama() {
  return useQuery({
    queryKey: ["jdrama"],
    queryFn: getJDrama
  })
}

export function useAsianDrama() {
  return useQuery({
    queryKey: ["asian-drama"],
    queryFn: getAsianDrama
  })
}