import axios from "axios";

const createInstance = axios.create({
    baseURL: 'http://localhost:8080/'
})

export default createInstance;