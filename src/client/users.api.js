const axios = require('axios');
const logger = require('../utils/logger');

async function userLogin(email, password) {
  const url = `${process.env.API_ENDPOINT_URL}/users/login`;
  try {
    const response = await axios.post(url, {
      username: email,
      password: password,
    });
    return response;
  } catch (error) {
    logger.error(`Error encountered calling userLogin endpoint ${url}`, error);
    throw error;
  }
}

async function userRegister(userData) {
  const url = `${process.env.API_ENDPOINT_URL}/users`;
  try {
    const response = await axios.post(url, userData);
    return response;
  } catch (error) {
    logger.error(
      `Error encountered calling userRegister endpoint ${url}`,
      error,
    );
    throw error;
  }
}

async function userUpdate(id, updateUserData) {
  const url = `${process.env.API_ENDPOINT_URL}/users/${id}`;
  try {
    const response = await axios.put(url, updateUserData);
    return response;
  } catch (error) {
    logger.error(`Error encountered calling userUpdate endpoint ${url}`, error);
    throw error;
  }
}

async function getUser(id) {
  const url = `${process.env.API_ENDPOINT_URL}/users/${id}`;
  try {
    const response = await axios.get(url);
    return response;
  } catch (error) {
    logger.error(`Error encountered calling getUser endpoint ${url}`, error);
    throw error;
  }
}

async function updateUserPassword(id, updatePasswordData) {
  const url = `${process.env.API_ENDPOINT_URL}/users/${id}/password`;
  try {
    const response = await axios.put(url, updatePasswordData);
    return response;
  } catch (error) {
    logger.error(
      `Error encountered calling updateUserPassword endpoint ${url}`,
      error,
    );
    throw error;
  }
}

module.exports = {
  userLogin,
  userRegister,
  userUpdate,
  getUser,
  updateUserPassword,
};
