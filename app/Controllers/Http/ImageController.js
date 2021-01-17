"use strict";

const Helpers = use("Helpers");
const Database = use("Database");
const Drive = use("Drive");

class ImageController {
  async index({ auth, request, view }) {
    const { page } = request.all();
    const imagesPerPage = 5;

    const imageObjects = await Database.from("images")
      .where("user_id", auth.user.id)
      .paginate(page ? page : 1, imagesPerPage);
    const imageNames = imageObjects.data.map((image) => image.name);
    const base64Strings = [];

    for (let imageName of imageNames) {
      const image = await Drive.get(`uploads/${imageName}`);
      const base64String = Buffer.from(image).toString("base64");
      base64Strings.push(base64String);
    }
    return view.render("images", {
      images: base64Strings,
      page: imageObjects.page,
      pages: Array(imageObjects.lastPage)
        .fill(0)
        .map((_, index) => index + 1),
    });
  }
  async uploadView({ view }) {
    return view.render("upload");
  }
  async upload({ auth, request, response, session }) {
    try {
      const images = request.file("images", {
        types: ["image"],
        size: "2mb",
      });
      await images.moveAll(Helpers.tmpPath("uploads"), (file) => {
        return {
          name: `${new Date().getTime()}.${file.subtype}`,
        };
      });
      const imageNames = images._files.reduce((images, image) => {
        if (image.fileName) {
          images.push({
            user_id: auth.user.id,
            name: image.fileName,
          });
        }
        return images;
      }, []);

      if (!images.movedAll()) {
        return images.errors();
      }

      await auth.user.images().createMany(imageNames);

      return response.redirect("/images");
    } catch (error) {
      console.log(error.message);
      if (error.message === "dest already exists.") {
        session.flash({
          error: "One or more images have already been uploaded",
        });
        return response.redirect("back");
      }
    }
  }
}

module.exports = ImageController;
