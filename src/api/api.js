import axios from 'axios';

let base = '';

export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };

export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };

export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };

export const getNpList = params => { return axios.get(`${base}/np/list`, { params: params }); };

export const getNpListPage = params => { return axios.get(`${base}/np/listpage`, { params: params }); };

export const getUnenoughGoods = params => { return axios.get(`${base}/goods/unenoughGoods`, { params: params }); };

export const removeNp = params => { return axios.get(`${base}/np/remove`, { params: params }); };

export const batchRemoveNp = params => { return axios.get(`${base}/np/batchremove`, { params: params }); };

export const editNp = params => { return axios.get(`${base}/np/edit`, { params: params }); };

export const addNp = params => { return axios.get(`${base}/np/add`, { params: params }); };
