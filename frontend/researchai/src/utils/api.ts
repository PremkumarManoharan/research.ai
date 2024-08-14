// utils/api.ts
import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: "https://backend-mu-topaz.vercel.app",
  timeout: 10000,
  headers: {},
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // const token = localStorage.getItem("token");
    // if (token) {
    //   config.headers["Authorization"] = `Bearer ${token}`;
    // }
    return config;
  },
  (error: AxiosError) => {
    // Handle request error here
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized, logging out...");
      // You can perform a logout operation here if needed
    } else if (error.response?.status === 500) {
      console.error("Server error, try again later.");
    }
    return Promise.reject(error);
  }
);

export const uploadPdf = async (
  file: File,
  queryParameters: { email: string; filename: string }
): Promise<any> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const response: AxiosResponse = await axiosInstance.post(
      `/pdf/upload?email=${queryParameters.email}`,
      arrayBuffer,
      {
        headers: {
          "Content-Type": "application/pdf",
          filename: queryParameters.filename,
        },
        timeout: 20000,
      }
    );
    console.log(response.status);
    return { data: response.data, status: response.status };
  } catch (error) {
    return { failerror: error };
  }
};

export const getPdfs = async (email: string): Promise<any> => {
  try {
    console.log("Email:", email);
    const response = await axiosInstance.get(`getFiles?email=${email}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.data) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error("Error posting data:", error);
  }
};

export const getPdf = async (email: string, fileId: string): Promise<any> => {
  try {
    const response = await axiosInstance.get(
      `pdf/retrieve/${fileId}?email=${email}`,
      { responseType: "arraybuffer" }
    );
    if (response.data) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error("Error getting data:", error);
  }
};

interface GetNotesResponse {
  _id: string;
  content: string;
  email: string;
}

export const getNotes = async (email: string): Promise<any> => {
  try {
    const response = await axiosInstance.get(`notes?email=${email}`, {
      responseType: "json",
    });
    console.log("Response:", response.data);
    if (response.data) {
      return response.data;
    }

    return {
      _id: "",
      content: "",
      email: "",
    };
  } catch (error) {
    console.error("Error getting data:", error);
  }
};

export const postNotes = async (email: string, notes: any) => {
  try {
    const response = await axiosInstance.post(`notes?email=${email}`, notes);
    console.log("Response:", response.data);
    if (response.data) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error("Error posting data:", error);
  }
};

export const deleteFile = async (fileId: string) => {
  try {
    const response = await axiosInstance.delete(`pdf/delete/${fileId}`);
    console.log("Response:", response.data);
    if (response.data) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error("Error posting data:", error);
  }
};

export const createUser = async (email: string, name: string) => {
  try {
    const response = await axiosInstance.post(`user`, { email, name });
    console.log("Response:", response.data);
    if (response.data) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error("Error posting data:", error);
  }
};

export default axiosInstance;
