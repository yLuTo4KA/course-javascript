const http = require('node:http');
const https = require('node:https');
const url = require('node:url');

const DB = {
  tokens: new Map(),
  likes: new Map(),
  comments: new Map(),
};

const methods = {
  like(req, res, url, vkUser) {
    const photoId = url.searchParams.get('photo');
    const userToken = req.header['vk_token'];
    if(!userToken){
      res.statusCode = 401;
      res.end('Пользователь не авторизован');
      return;
    }
    if(DB.likes.has(photoId) && DB.likes.get(photoId).has(userToken)){
      DB.likes.get(photoId).delete(userToken);
      res.statusCode = 200;
      res.end('Вы убрали лайк');
      return;
    }else{
      if(!DB.likes.has(photoId)){
        DB.likes.get(photoId, new Set());
      }
      DB.likes.get(photoId).add(userToken);
      res.statusCode = 200;
      res.end('Вы поставили лайк');
      return;
    }
  },
  photoStats(req, res, url, vkUser) {
    const photoId = url.searchParams.get('photo');
    // const userToken = req.header['vk_token'];
    const likeCount = DB.likes.has(photoId) ? DB.likes.get(photoId).size : 0;
    const commentCount = DB.comments.has(photoId) ? DB.comments.get(photoId).length : 0;

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({likes: likeCount, comments: commentCount}));
  },
  postComment(req, res, url, vkUser, body) {
    const photoId = url.searchParams.get('photo');
    const text = body.text;

    const userToken = req.header['vk_token'];
    if(!userToken){
      res.statusCode = 401;
      res.end('Пользователь не авторизован');
      return;
    }
    const comment = {user: vkUser, text: text};
    if(!DB.comments.has(photoId)){
      DB.comments.set(photoId, []);
    }
    DB.comments.get(photoId).push(comment);
    res.statusCode = 200;
    res.end('Комментарий отправлен');
  },
  getComments(req, res, url) {
    const photoId = url.searchParams.get('photo');
    if(!DB.comments.has(photoId)){
      res.statusCode = 404;
      res.end('Комментариев нет!');
      return;
    }
    const comments = DB.comments.get(photoId);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(comments));
  },
};

http
  .createServer(async (req, res) => {
    console.log('➡️ Поступил запрос:', req.method, req.url);
    const token = req.headers['vk_token'];
    const parsed = new url.URL(req.url, 'http://localhost');
    const vkUser = await getMe(token);
    const body = await readBody(req);
    const method = parsed.searchParams.get('method');
    const responseData = await methods[method]?.(req, res, parsed, vkUser, body);

    res.end(JSON.stringify(responseData ?? null));
  })
  .listen('8888', () => {
    console.log('🚀 Сервер запущен');
  });

async function readBody(req) {
  if (req.method === 'GET') {
    return null;
  }

  return new Promise((resolve) => {
    let body = '';
    req
      .on('data', (chunk) => {
        body += chunk;
      })
      .on('end', () => resolve(JSON.parse(body)));
  });
}

async function getVKUser(token) {
  const body = await new Promise((resolve, reject) =>
    https
      .get(
        `https://api.vk.com/method/users.get?access_token=${token}&fields=photo_50&v=5.120`
      )
      .on('response', (res) => {
        let body = '';

        res.setEncoding('utf8');
        res
          .on('data', (chunk) => {
            body += chunk;
          })
          .on('end', () => resolve(JSON.parse(body)));
      })
      .on('error', reject)
  );

  return body.response[0];
}

async function getMe(token) {
  const existing = DB.tokens.get(token);

  if (existing) {
    return existing;
  }

  const user = getVKUser(token);

  DB.tokens.set(token, user);

  return user;
}
