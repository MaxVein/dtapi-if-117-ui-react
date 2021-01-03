import axios from "axios"
import {environment} from "../enviroments/enviroment"


export const addEntity = (entity,payload)=>{
    return axios.post(`${environment.BASEURL}${entity}/insertData`,payload)
}

export const deleteEntity = (entity, id)=>{
    return axios.get(`${environment.BASEURL}${entity}/del/${id}`)
}

export const login = ()=>{
    return axios.post(`${environment.BASEURL}login/index`,{
        username: 'admin',
        password: 'dtapi_admin',
    })
}

export const getEntityData = (entity) => {
    return axios.get(`${environment.BASEURL}${entity}/getRecords/`)
  }
  export const updateEntity = (entity, id, payload) => {
    return axios.post(`${environment.BASEURL}${entity}/update/${id}`, payload)
  }