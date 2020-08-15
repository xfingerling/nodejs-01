const { AvatarGenerator } = require("random-avatar-generator");
const axios = require("axios");
const uniqid = require("uniqid");
const fs = require("fs");
const path = require("path");

const generator = new AvatarGenerator();

async function generateAvatar() {
  const avatarURL = generator.generateRandomAvatar();

  const fileDir = await saveAvatar(avatarURL);
  const newDir = await moveFile(fileDir);

  const fileName = path.basename(newDir);

  const staticUrl = path.join(
    `localhost:${process.env.PORT}/images/${fileName}`
  );

  return staticUrl;
}

async function saveAvatar(url) {
  try {
    const { data } = await axios.get(url);

    const baseDir = path.join(__dirname, "/../../tmp/");
    const fileDir = `${baseDir}${uniqid()}.svg`;

    fs.writeFile(fileDir, data, "utf8", (err) => {
      if (err) {
        return console.log(err);
      }

      console.log("avatar did save");
    });

    return fileDir;
  } catch (err) {
    console.log(err);
  }
}

async function moveFile(oldPath) {
  const fileName = path.basename(oldPath);
  const newPath = path.join(__dirname, "/../../public/images/") + fileName;

  fs.rename(oldPath, newPath, (err) => {
    if (err) throw err;
    console.log("Rename complete!");
  });

  return newPath;
}

module.exports = generateAvatar;
