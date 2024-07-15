import axios from 'axios';
const baseURL = import.meta.env.VITE_BASE_URL
export const requestChinaData = () => {
  return axios.get(`${baseURL}/json/china.json`).then(data => data.data);
};
export const getGuangdongJson = () => {
  return axios.get(`${baseURL}/json/province/440000.json`).then(data => data.data);
};
export const requestProvinceJson = (id: string | number) => {
  return axios.get(`${baseURL}/json/province/${id}.json`).then(data => data.data);
};
export const requestCityJson = (id: string | number) => {
  return axios.get(`${baseURL}/json/city/${id}.json`).then(data => data.data);
};

export const requestTownJson = (id: string | number) => {
  return axios.get(`${baseURL}/json/town/${id}.json`).then(data => data.data);
};

export const getColumns = () => {
  return axios.get(`${baseURL}/json/select.json`).then(data => data.data);
};
export const getDataSource = () => {
  return axios.get(`${baseURL}/json/5a.json`).then(data => data.data);
};

export const getGuangdongSource = () => {
  return axios.get(`${baseURL}/json/gd.json`).then(data => data.data);
};
export const getQingyuanSource = () => {
  return axios.get(`${baseURL}/json/qingyuan.json`).then(data => data.data);
};

export const getGuangzhouYuea = () => {
  return axios.get(`${baseURL}/json/yuea.json`).then(data => data.data);
};
export const getWuliScore2024 = () => {
  return axios.get(`${baseURL}/json/2024wuli.json`).then(data => data.data);
};
export const getLishiScore2024 = () => {
  return axios.get(`${baseURL}/json/2024lishi.json`).then(data => data.data);
};

