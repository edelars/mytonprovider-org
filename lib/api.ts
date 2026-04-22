import axios, { AxiosError } from "axios"
import type { Provider, ApiResponse } from "@/types/provider"
import { FiltersData, FiltersRange } from "@/types/filters";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? (process.env.NODE_ENV === "development" ? "http://localhost:9090" : "")

export async function fetchFiltersRange(): Promise<ApiResponse> {
  var loading = false;
  var filters: FiltersRange | null = null;
  var errorMsg: string | null = null;

  const request = async () => {
      if (loading) {
          return
      }

      loading = true
      await axios.get(`${apiBaseUrl}/api/v1/providers/filters`)
      .then((response) => {
          loading = false
          filters = response.data.filters_range as FiltersRange;
          console.log("Fetched filters:", filters);
      })
      .catch((error: AxiosError) => {
          loading = false
          errorMsg = error.message;
          console.error("Error loading filters:", errorMsg)
      })
  };

  await request();

  return {
    errorMsg: errorMsg,
    data: filters
  } as ApiResponse;
}

export async function fetchProviders(
  offset = 0,
  limit = 10,
  filters: FiltersData,
  sortField: string | null = null,
  sortDirection: string = "asc"
): Promise<ApiResponse> {
    var loading = false;
    var providers :Provider[] = [];
    var errorMsg : string | null = null;

    const request = async () => {
        if (loading) {
            return
        }

        loading = true
        await axios.post(`${apiBaseUrl}/api/v1/providers/search`, {
          filters: filters,
          sort: sortField
            ? { column: sortField, order: sortDirection }
            : undefined,
          exact: [],
          limit,
          offset,
        })
        .then((response) => {
            loading = false
            providers = response.data.providers as Provider[];
            console.log("Fetched providers:", providers);
        })
        .catch((error :AxiosError) => {
            loading = false
            errorMsg = error.message;
            console.error("Error loading products:", errorMsg)
        })
    };

    await request();

    return {
      errorMsg: errorMsg,
      data: providers
    } as ApiResponse;
}
