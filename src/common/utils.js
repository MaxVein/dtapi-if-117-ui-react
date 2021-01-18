import axios from 'axios';
import { environment } from '../environments/environment';

export const addEntity = (entity, payload) => {
    return axios.post(`${environment.BASEURL}${entity}/insertData`, payload);
};
export const deleteEntity = (entity, id) => {
    return axios.get(`${environment.BASEURL}${entity}/del/${id}`);
};
export const login = (body) => {
    return axios.post(`${environment.BASEURL}login/index`, body);
};
export const getEntityData = (entity, source, id = '') => {
    return axios.get(`${environment.BASEURL}${entity}/getRecords/${id}`, {
        cancelToken: source.token,
    });
};
export const updateEntity = (entity, id, payload) => {
    return axios.post(`${environment.BASEURL}${entity}/update/${id}`, payload);
};
export const entityManager = (entity, ids) => {
    return axios.post(`${environment.BASEURL}EntityManager/getEntityValues`, {
        entity: entity,
        ids: ids,
    });
};

export const isLogged = () => {
    return axios.get(`${environment.BASEURL}login/isLogged`);
};

export const logOut = () => {
    return axios.get(`${environment.BASEURL}login/logout`);
};
