import axios from "axios";

// Set config defaults when creating the instance
const rest = axios.create({
  baseURL: "http://localhost:8080/api/rest",
});

rest.defaults.headers.common["Content-Type"] = "application/json";

// Alter defaults after instance has been created
// instance.defaults.headers.common["Authorization"] = AUTH_TOKEN;

export default rest;
