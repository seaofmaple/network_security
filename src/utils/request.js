import axios from 'axios';

export const request = (config) => {
  const instance = axios.create({
    baseURL: 'http://localhost:3002',
    timeout: 3000,
    withCredentials: true
  });

  instance.interceptors.request.use(config => {
    return config;
  }, err => {
    console.log(err)
  });

  instance.interceptors.response.use(res => {
    return res;
  }, err => {
    console.log(err)
  })

  return instance(config)
}

