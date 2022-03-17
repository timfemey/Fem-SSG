import { promisify } from "util";
import * as fs from "fs";
import path from "path";
import ejs from "ejs";
import glob from "glob";

const render = (data, callback) => ejs.renderFile(data, callback);

import config from "../fem-ssg.config.js";

const site_content = "./site_content";
const output = "./public";

console.time("fem-ssg");

const readdir = promisify(fs.readdir);
const unlink = promisify(fs.unlink);
const createDir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);
const copy = promisify(fs.copyFile);
const deleteDir = promisify(fs.rmdir);

console.log("Loading");
const files = await readdir(output);
const filesCopy = await readdir(site_content);

if (fs.existsSync(`${output}/assets`)) {
  let assets = await readdir(`${output}/assets`);
  assets.map((filename) => {
    deleteDir(filename);
  });
} else {
  createDir(`${output}/assets`).then(() => {
    if (filesCopy.length > 0) {
      filesCopy.map((filename) =>
        copy(`${output}/assets/${filename}`, `${output}/assets/${filename}`)
      );
    } else {
      return;
    }
  });
}

if (fs.existsSync(`${output}/views`)) {
  files.map((filename) => {
    if (fs.existsSync(`${output}/views/${filename}.html`))
      deleteDir(`${output}/views/${filename}.html`);
  });
}

glob("**/*.ejs", { cwd: `${site_content}/pages` }, (err, filename) => {
  if (err) return console.error(err);
  filename.forEach((file) => {
    const fileData = path.parse(file);
    const destination = path.join(output, fileData.dir);
    let obj = Object.create(config);
    createDir(destination, { recursive: true }).then(() => {
      render(`${site_content}/structure.ejs`, newObj)
        .then((structure) => {
          writeFile(`${destination}/views/${fileData.name}.html`, structure);
          console.log("Done");
        })
        .catch((err) => {
          console.log(`Error Writing File`);
          console.error(err);
        });
    });
  });
});

console.timeEnd("fem-ssg");
