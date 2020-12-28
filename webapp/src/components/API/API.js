import axios from "axios";

const API = axios.create({
  baseURL: 'http://localhost:4000/api/v2/'
});

export default API;