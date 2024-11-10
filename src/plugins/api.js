import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080', // Replace with your API URL
  timeout: 100000000,
})
// Request interceptor to add the API key to the headers
api.interceptors.request.use(
  (config) => {
    const apiKey = localStorage.getItem('token')
     // Retrieve the API key (stored as token) from localStorage
    if (apiKey) {
      // If the server expects an API key in the Authorization header (without 'Bearer')
      config.headers.Authorization = apiKey  // Add API key as Authorization header
      // Or if your server expects the API key in a custom header like `x-api-key`
      // config.headers['x-api-key'] = apiKey  // Uncomment this line if needed
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default api
