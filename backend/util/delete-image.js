const fs = require("fs");

const deleteImage = (imageUrl) => {
  fs.unlink(imageUrl, (err) => {
    if (err) throw err;
  });
};

module.exports = deleteImage;
