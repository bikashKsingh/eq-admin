type HostType = "localhost" | "";

const hostname: HostType = window.location.hostname as HostType;

export const BASE_URL = "http://localhost:5173";
export const API_URL =
  hostname == "localhost"
    ? "http://127.0.0.1:5500/api/v1"
    : "http://eq-api.esta-dev.com/api/v1";

export const FILE_URL =
  hostname == "localhost"
    ? "http://127.0.0.1:5500/uploads"
    : "http://eq-api.esta-dev.com/uploads";
