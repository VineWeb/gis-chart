import axios from 'axios';
export const requestChinaData = () => {
  return axios.get(`/json/china.json`).then(data => data.data);
};
export const getGuangdongJson = () => {
  return axios.get(`/json/province/440000.json`).then(data => data.data);
};
export const requestProvinceJson = (id: string | number) => {
  return axios.get(`/json/province/${id}.json`).then(data => data.data);
};
export const requestCityJson = (id: string | number) => {
  return axios.get(`/json/city/${id}.json`).then(data => data.data);
};

export const requestTownJson = (id: string | number) => {
  return axios.get(`/json/town/${id}.json`).then(data => data.data);
};

export const getColumns = () => {
  return axios.get(`/json/select.json`).then(data => data.data);
};
export const getDataSource = () => {
  return axios.get(`/json/5a.json`).then(data => data.data);
};

export const getGuangdongSource = () => {
  return axios.get(`/json/gd.json`).then(data => data.data);
};
export const getQingyuanSource = () => {
  return axios.get(`/json/qingyuan.json`).then(data => data.data);
};


export const getGuangzhouYuea = () => {
  return axios.get(`/json/yuea.json`).then(data => data.data);
};