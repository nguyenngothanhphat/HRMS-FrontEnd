import * as axios from 'axios';

export default async function uploadFile(files, params) {
  return axios.post('/file/upload', { files, params });
}
