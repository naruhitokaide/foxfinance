import axios from 'axios'

export const requestAPICall = async (url) => {
  return await axios.get(url)
}
