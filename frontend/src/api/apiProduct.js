import { API } from '../config';

export const getProducts = () => {
    return fetch("http://127.0.0.1:8000/api/blockurl/", {
        method: 'GET',
      })
      .then(res => res.json())
      .then(res => {
        return res;
      })
      .catch((err) => {
    
      })
}