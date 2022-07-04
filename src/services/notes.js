import axios from 'axios'
const baseUrl = '/api/notes'

const create = (newNoteObject) => {
    return axios.post(baseUrl, newNoteObject).then(res => res.data)
  }

const read =  () => {
  return axios.get(baseUrl).then(res => res.data)
}

const update =  (id, newNoteObject) => {
  return axios.put(`${baseUrl}/${id}`, newNoteObject).then(res => res.data)
}

const note = { create, read, update }

export default note;