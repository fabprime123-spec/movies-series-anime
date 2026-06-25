import { useQuery } from "@tanstack/react-query";

import {
  getAnime,
  getDocumentaries,
  getKDrama,
  getCDrama
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