export default responseBindMiddleware;

function responseBindMiddleware(req, res, next) {
    res.send = res.send.bind(res);
    res.json = res.json.bind(res);
    next();
}