const deleteImage = require("../util/delete-image");

const errorHandler = (error, req, res, next) => {
  if (req.file) deleteImage(req.file.path);

  res
    .status(error.statusCode || 500)
    .json({ message: error.message || "An unknown error occurred!" });
};

module.exports = errorHandler;
