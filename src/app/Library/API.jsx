import useSWR from "swr";

const BASE_URL = "http://localhost:8082";

// Generic fetcher function
const fetcher = async (url, method = "GET", data = null) => {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    ...(data && { body: JSON.stringify(data) }),
  };

  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error("Failed to fetch");
  }
  return response.json();
};

// Custom SWR hook
export const useSWRBackendAPI = (endpoint, method = "GET", data = null, refreshInterval = 0) => {
  const url = `${BASE_URL}/${endpoint}`;

  const { data: result, error, isLoading, mutate } = useSWR(
    [url, method, data], // key (unique per request)
    () => fetcher(url, method, data), // fetcher function
    {
      refreshInterval,        // ⏱ auto revalidate every X ms (e.g., 60000 = 60s)
      revalidateOnFocus: true, // refetch when window regains focus
      revalidateOnReconnect: false, // refetch when network reconnects
    }
  );

  return { result, error, isLoading, mutate };
};


 // ✅ BackendAPI with revalidate support
export async function useFetchBackendAPI(
  endpoint,
  { method = "POST", data = null, revalidate = 0 } = {}
) {
  if (!endpoint) throw new Error("Endpoint is required");

  const url = `${BASE_URL}/${endpoint}`;
  // console.log(url,method)
  // console.log(data)

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    ...(data && { body: JSON.stringify(data) }),
    next: { revalidate }, // ISR-style caching for Next.js App Router
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorDetails = await response.text().catch(() => "");
      throw new Error(
        `Request failed: ${response.status} ${response.statusText}\n${errorDetails}`
      );
    }
    const respon=await response.json();
    return { data:respon , status: response.status , ok: true };
  } catch (error) {
    console.error(`[BackendAPI] ${method} ${url} →`, error);
    return { error: error.message , status: error.status || 500}}; // rethrow so caller can handle it
  }




