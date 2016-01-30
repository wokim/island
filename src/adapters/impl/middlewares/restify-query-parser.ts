import * as qs from 'qs';

export default function queryParser() {
  return (req, res, next) => {
    if (!req.getQuery()) {
      req.query = {};
      return next();
    }

    req.query = qs.parse(req.getQuery(), { allowDots: true });
    return next();
  };
}
