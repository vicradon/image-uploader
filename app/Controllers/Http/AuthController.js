"use strict";
const User = use("App/Models/User");
const { validateAll } = use("Validator");

class AuthController {
  async signup({ auth, session, request, response }) {
    try {
      const { email, password, remember } = request.all();
      const rules = {
        email: "required|unique:users,email",
        password: "required",
      };

      const validation = await validateAll(request.all(), rules);
      if (validation.fails()) {
        session.withErrors(validation.messages()).flashAll();
        return response.redirect("back");
      }

      const user = await User.create({ email, password });

      if (!remember) {
        await auth.attempt(email, password);
      } else {
        await auth.remember(true).attempt(email, password);
      }

      session.flash({ success: "Account created successfully" });
      response.cookie("email", email);
      return response.redirect("/images");
    } catch (error) {
      session.flash({ error: "An error occured, please try again" });
      console.error(error.message);
      return response.redirect("back");
    }
  }
  async login({ auth, session, request, response }) {
    try {
      const { email, password, remember } = request.all();
      const rules = {
        email: "required",
        password: "required",
      };

      const validation = await validateAll(request.all(), rules);
      if (validation.fails()) {
        session.withErrors(validation.messages()).flashAll();
        return response.redirect("back");
      }

      if (!remember) {
        await auth.attempt(email, password);
      } else {
        await auth.remember(true).attempt(email, password);
      }
      session.flash({ success: "Logged in successfully" });
      response.cookie("email", email);
      return response.redirect("/images");
    } catch (error) {
      session.flash({ error: "An error occured, please try again" });
      console.error(error.message);
      return response.redirect("back");
    }
  }
  async signupView({ view }) {
    try {
      return view.render("signup");
    } catch (error) {
      console.error(error);
    }
  }
  async loginView({ view }) {
    try {
      return view.render("login");
    } catch (error) {
      console.error(error);
    }
  }
  async logout({ auth, response }) {
    try {
      await auth.logout();
      response.redirect("/");
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = AuthController;
