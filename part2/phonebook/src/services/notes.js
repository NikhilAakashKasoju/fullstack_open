import axios from "axios"

const baseUrl = "http://localhost:3001/persons"

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = newObject => {
    const request = axios.post(baseUrl, newObject)
    return request.then(response => response.data)
}

const update = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject) //`${baseUrl}/${id}` → "http://localhost:3001/persons/5"  // if id = 5
    return request.then(response => response.data)
}

const remove = (id) => {
    return axios.delete(`${baseUrl}/${id}`).then(response => console.log(response.data))
}

export default { getAll, create, update, remove }

