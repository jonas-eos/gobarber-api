import { Router } from "express";
const routes = new Router();

routes.get("/", (__request, __response) => {
  return __response.json({
    message: "Hello World"
  });
});

export default routes;
