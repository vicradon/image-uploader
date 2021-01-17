"use strict";

class ErrorController {
  async 404({ view }) {
    return view.render("404");
  }
  async 401({ view }) {
    return view.render("401");
  }
}

module.exports = ErrorController;
