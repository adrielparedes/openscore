import axios from "axios";

// Set config defaults when creating the instance
const rest = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/rest`,
});

rest.defaults.headers.common["Content-Type"] = "application/json";
// rest.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem(
//   TOKEN_KEY
// )}`;

// Alter defaults after instance has been created

export default rest;
