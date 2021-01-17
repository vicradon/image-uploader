"use strict";

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.get("/", "HomeController.index").as("home");

Route.group(function () {
  Route.post("login", "AuthController.login");
  Route.get("login", "AuthController.loginView");
  Route.post("signup", "AuthController.signup");
  Route.get("signup", "AuthController.signupView");
  Route.post("logout", "AuthController.logout");
}).prefix("auth");

Route.group(function () {
  Route.get("", "ImageController.index");
  Route.get("/upload", "ImageController.uploadView");
  Route.post("/upload", "ImageController.upload");
})
  .prefix("images")
  .middleware(["auth"]);

Route.get("404", "ErrorController.404");
Route.get("401", "ErrorController.401");
