import { toast } from "react-toastify";
import { API_URL } from "../constants";

type HeadersContent = {
  "Content-Type": string;
  Authorization?: string;
};

type ApiResponse = {
  status: 200 | 400 | 403;
  message: string;
  errors?: any;
  body: any;
  page?: number;
  totalPages?: number;
  totalRecords?: number;
};

export async function get(endpoint: string, isProtected: boolean = false) {
  const url: string = `${API_URL}${endpoint}`;

  const headers: HeadersContent = {
    "Content-Type": "application/json",
  };

  const token = localStorage.getItem("token");

  if (isProtected) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const apiResponse = await fetch(url, {
      method: "GET",
      headers,
    });

    const apiData: ApiResponse = await apiResponse.json();

    return apiData;
  } catch (error: any) {
    console.log("Api response error at api.tsx", error.message);
    toast.error(error.message);
  }
}

export async function post(
  endpoint: string,
  data: object,
  isProtected: boolean = false
) {
  const url: string = `${API_URL}${endpoint}`;
  const body: string = JSON.stringify(data);

  const headers: HeadersContent = {
    "Content-Type": "application/json",
  };

  const token = localStorage.getItem("token");

  if (isProtected) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const apiResponse = await fetch(url, {
      method: "POST",
      body,
      headers,
    });

    const apiData: ApiResponse = await apiResponse.json();

    // if (apiData.status == 403) {
    //   localStorage.clear();
    // }

    return apiData;
  } catch (error: any) {
    console.log("Api response error at api.tsx", error.message);
    toast.error(error.message);
  }
}

// export async function put(endpoint: string, data: object, jwtToken?: string) {
//   const url: string = `${API_URL}${endpoint}`;
//   const body: string = JSON.stringify(data);

//   let token = "";
//   if (jwtToken) token = jwtToken;
//   else token = localStorage.getItem("token") as string;

//   const headers: HeadersContent = {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${token}`,
//   };

//   try {
//     const apiResponse = await fetch(url, {
//       method: "PUT",
//       body,
//       headers,
//     });

//     const apiData: ApiResponse = await apiResponse.json();
//     return apiData;
//   } catch (error: any) {
//     console.log("Api response error at api.tsx", error.message);
//     toast.error(error.message);
//   }
// }

export async function put(endpoint: string, data: object, jwtToken?: string) {
  const url: string = `${API_URL}${endpoint}`;
  const body: string = JSON.stringify(data);

  const token = jwtToken ? jwtToken : localStorage.getItem("token");
  const headers: HeadersContent = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  try {
    const apiResponse = await fetch(url, {
      method: "PUT",
      body,
      headers,
    });

    const apiData: ApiResponse = await apiResponse.json();

    // if (apiData.status == 403) {
    //   localStorage.clear();
    // }

    return apiData;
  } catch (error: any) {
    console.log("Api response error at api.tsx", error.message);
    toast.error(error.message);
  }
}

export async function remove(endpoint: string, recordIds?: string[]) {
  const url: string = `${API_URL}${endpoint}`;

  const token = localStorage.getItem("token");

  const headers: HeadersContent = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  try {
    let apiResponse = null;
    if (recordIds) {
      apiResponse = await fetch(url, {
        method: "DELETE",
        headers,
        body: JSON.stringify({ ids: recordIds }),
      });
    } else {
      apiResponse = await fetch(url, { method: "DELETE", headers });
    }

    const apiData: ApiResponse = await apiResponse?.json();

    // if (apiData.status == 403) {
    //   localStorage.clear();
    // }

    return apiData;
  } catch (error: any) {
    console.log("Api response error at api.tsx", error.message);
    toast.error(error.message);
  }
}
