const axios = require('axios');
const logger = require('../utils/logger');

async function getArticles(filterData) {
  try {
    let searchData = {
      page: filterData.page || 1, // Use provided page or default to 1
      limit: filterData.limit || 10, // Use provided limit or default to 10
    };

    //Note: api search data can have page, limit, author, search
    if (!filterData.isDeleted) {
      searchData.isDeleted = false;
    }

    if (filterData.author) {
      searchData.author = filterData.author;
    }

    if (filterData.search) {
      searchData.search = filterData.search.trim();
    }

    const response = await axios.get(
      `${process.env.API_ENDPOINT_URL}/articles`,
      {
        data: searchData,
      },
    );

    return response.data;
  } catch (error) {
    logger.error(
      `Error encountered calling getArticles API endpoint ${url}`,
      error,
    );
    throw error;
  }
}

async function createNewArticle(newArticleData) {
  const url = `${process.env.API_ENDPOINT_URL}/articles`;
  try {
    const newArticle = {
      author: newArticleData.userId,
      image: newArticleData.image,
      headline: newArticleData.headline,
      subhead: newArticleData.subhead,
      content: newArticleData.content,
    };
    const response = await axios.post(url, newArticle);
    return response;
  } catch (error) {
    logger.error(
      `Error encountered calling createNewArticle API endpoint ${url}`,
      error,
    );
    throw error;
  }
}

async function getArticle(id) {
  const url = `${process.env.API_ENDPOINT_URL}/articles/${id}`;
  try {
    const response = await axios.get(url);
    return response;
  } catch (error) {
    logger.error(
      `Error encountered calling getArticle API endpoint ${url}`,
      error,
    );
    throw error;
  }
}

async function updateArticle(id, updateArticleData) {
  const url = `${process.env.API_ENDPOINT_URL}/articles/${id}`;
  try {
    const response = await axios.put(url, updateArticleData);
    return response;
  } catch (error) {
    logger.error(
      `Error encountered calling updateArticle API endpoint ${url}`,
      error,
    );
    throw error;
  }
}

async function deleteArticle(id) {
  const url = `${process.env.API_ENDPOINT_URL}/articles/${id}`;
  try {
    const response = await axios.delete(url);
    return response;
  } catch (error) {
    logger.error(
      `Error encountered calling deleteArticle API endpoint ${url}`,
      error,
    );
    throw error;
  }
}

module.exports = {
  getArticles,
  createNewArticle,
  getArticle,
  updateArticle,
  deleteArticle,
};
