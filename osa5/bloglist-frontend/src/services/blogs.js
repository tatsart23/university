import axios from 'axios';
const baseUrl = '/api/blogs';

let token = null;

// Asetetaan token
const setToken = newToken => {
  token = `Bearer ${newToken}`;
};

// Haetaan kaikki blogit
const getAll = async () => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.get(baseUrl, config);
  return response.data;
};

// Luodaan uusi blogi
const create = async (blogData) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.post(baseUrl, blogData, config);
  return response.data;
};

// Päivitetään blogi id:n perusteella
const update = async (id, updatedBlog) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.put(`${baseUrl}/${id}`, updatedBlog, config);
  return response.data;
};

const deleteBlog = async (id) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.delete(`${baseUrl}/${id}`, config);
  return response.data;
};

export default { getAll, setToken, create, update, deleteBlog };
