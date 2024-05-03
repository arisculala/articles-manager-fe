const express = require('express');
const articlesRouter = express.Router();
const logger = require('../utils/logger');
const routeUtils = require('../utils/route_utils');
const { PAGES, ROUTES, URLS_REDIRECT } = require('../utils/constants');
const {
  getArticles,
  createNewArticle,
  getArticle,
  updateArticle,
  deleteArticle,
} = require('../client/articles.api');

// <----------------- General Articles
let articles = [];
let pagination = {
  page: 1,
  perPage: 10,
  totalPages: 1,
  totalItems: 1,
};

articlesRouter.get(ROUTES.HOME, async (req, res) => {
  try {
    const filterData = {
      page: 1,
      limit: 10,
    };
    const response = await getArticles(filterData);
    articles = response.articles;
    pagination = response.pagination;
  } catch (error) {
    logger.error(`Error encountered articlesRouter get /`, error);
    articles = [];
  }
  res.render(PAGES.ARTICLES, {
    articles: articles,
    pagination: pagination,
    search: '',
  });
});

articlesRouter.get(ROUTES.ARTICLES, async (req, res) => {
  const { page, limit, search } = req.query;
  try {
    const filterData = {
      page: parseInt(page),
      limit: parseInt(limit),
      search: search,
    };

    const response = await getArticles(filterData);
    articles = response.articles;
    pagination = response.pagination;
    res.render(PAGES.ARTICLES, {
      articles: articles,
      pagination: pagination,
      search: search,
    });
  } catch (error) {
    logger.error(`Error encountered articlesRouter get /articles`, error);
    res.redirect(PAGES.HOME);
  }
});

articlesRouter.get(`${ROUTES.ARTICLES}/:id`, async (req, res) => {
  try {
    const articleId = req.params.id;
    const response = await getArticle(articleId);
    res.render('pages/article_modal', { article: response.data });
  } catch (error) {
    logger.error(
      `Error encountered articlesRouter get /my-articles/{id}`,
      error,
    );
    res.render(PAGES.MY_ARTICLES);
  }
});

// <----------------- My Articles
const getMyArticlesData = async (res, filterData) => {
  try {
    const searchData = {
      page: parseInt(filterData.page),
      limit: parseInt(filterData.limit),
      search: filterData.search,
      author: filterData.id,
    };
    const response = await getArticles(searchData);
    const articles = response.articles;
    const pagination = response.pagination;
    return { articles, pagination };
  } catch (error) {
    throw error;
  }
};

let myArticles = [];
let myArticlesPagination = {
  page: 1,
  perPage: 10,
  totalPages: 1,
  totalItems: 1,
};

articlesRouter.get(ROUTES.MY_ARTICLES, async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  try {
    const userId = res.locals.user.id;

    const filterData = {
      page: parseInt(page),
      limit: parseInt(limit),
      search: search,
      id: userId,
    };

    const response = await getMyArticlesData(res, filterData);
    myArticles = response.articles;
    myArticlesPagination = response.pagination;
    res.render(PAGES.MY_ARTICLES, {
      articles: myArticles,
      pagination: myArticlesPagination,
      search: search,
    });
  } catch (error) {
    logger.error(`Error encountered articlesRouter get /my-articles`, error);
    res.redirect(PAGES.HOME);
  }
});

articlesRouter.get(`${ROUTES.MY_ARTICLES}/new`, async (req, res) => {
  try {
    res.render(PAGES.ARTICLE_EDITOR);
  } catch (error) {
    logger.error(
      `Error encountered articlesRouter get /my-articles/new`,
      error,
    );
    res.render(PAGES.MY_ARTICLES);
  }
});

articlesRouter.post(`${ROUTES.MY_ARTICLES}/new`, async (req, res) => {
  try {
    const { headline, subhead, image, content } = req.body;

    const newArticleData = {
      headline,
      subhead,
      image,
      content,
      userId: res.locals.user.id,
    };

    const response = await createNewArticle(newArticleData);

    if (response.status === 201) {
      const userId = res.locals.user.id;

      const filterData = {
        page: 1,
        limit: 10,
        search: '',
        id: userId,
      };

      const response = await getMyArticlesData(res, filterData);
      myArticles = response.articles;
      myArticlesPagination = response.pagination;
      res.render(PAGES.MY_ARTICLES, {
        articles: myArticles,
        pagination: myArticlesPagination,
        search: '',
      });
    } else {
      logger.error(
        `Error encountered create new article`,
        response.data.message,
      );
    }
  } catch (error) {
    logger.error(
      `Error encountered articlesRouter post /my-articles/new`,
      error,
    );
  }
  res.render(PAGES.ARTICLE_EDITOR);
});

articlesRouter.get(`${ROUTES.MY_ARTICLES}/:id/edit`, async (req, res) => {
  try {
    const articleId = req.params.id;
    const response = await getArticle(articleId);
    res.render(PAGES.ARTICLE_EDITOR, { article: response.data });
  } catch (error) {
    logger.error(
      `Error encountered articlesRouter post /my-articles/new`,
      error,
    );
  }
});

articlesRouter.post(`${ROUTES.MY_ARTICLES}/:id/edit`, async (req, res) => {
  const articleId = req.params.id;
  let errorMessage = '';
  try {
    const { headline, subhead, image, content } = req.body;

    const updateArticleData = {
      headline,
      subhead,
      image,
      content,
    };

    const response = await updateArticle(articleId, updateArticleData);

    if (response.status === 200) {
      const userId = res.locals.user.id;
      const filterData = {
        page: 1,
        limit: 10,
        search: '',
        id: userId,
      };

      const response = await getMyArticlesData(res, filterData);
      myArticles = response.articles;
      myArticlesPagination = response.pagination;
      res.render(PAGES.MY_ARTICLES, {
        articles: myArticles,
        pagination: myArticlesPagination,
        search: '',
      });
    } else {
      logger.error(
        `Error encountered update article`,
        response.data.message,
      );
      errorMessage = response.data.message;
    }
  } catch (error) {
    logger.error(
      `Error encountered articlesRouter post /my-articles/${articleId}/edit`,
      error,
    );
    errorMessage = `Error encountered updating article with id ${articleId}`;
  }
  if (errorMessage) {
    const response = await getArticle(articleId);
    res.render(PAGES.ARTICLE_EDITOR, { errorMessage: errorMessage, article: response.data });
  }
});

articlesRouter.post(`${ROUTES.MY_ARTICLES}/:id/delete`, async (req, res) => {
  const articleId = req.params.id;

  try {
    const response = await deleteArticle(req.params.id);
    if (response.status === 200) {
      res.redirect(URLS_REDIRECT.MY_ARTICLES);
    } else {
      logger.error(`Error encountered delete article: ${response.data.message}`);
      res.render(PAGES.ARTICLE_EDITOR, { errorMessage: 'Failed to delete article. Please try again.' });
    }
  } catch (error) {
    logger.error(`Error encountered articlesRouter post /my-articles/${articleId}/delete: ${error}`);
    res.render(PAGES.ARTICLE_EDITOR, { errorMessage: 'Failed to delete article. Please try again.' });
  }
});

module.exports = articlesRouter;
