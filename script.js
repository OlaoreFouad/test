const fs = require("fs");
const path = require("path");
const child_process = require("child_process");

var fileContent = "";

function getFileContent(path) {
  return fs.readFileSync(path, {
    encoding: "utf8",
  });
}

function compileFolder(folder) {
  console.log("----Compiling " + folder + " folder------");
  let rootPath = `scss/${folder}/`;
  let _path = path.join(__dirname, rootPath);

  const files = fs
    .readdirSync(_path)
    .filter((filename) => filename.startsWith("_"));

  files.forEach((file) => {
    const _content = getFileContent(_path + file);
    fileContent += _content;
  });
}

function writeToFile(
  filename,
  toCompile = false,
  contentToWrite = fileContent
) {
  let _path = path.join(__dirname, filename);

  fs.writeFile(_path, contentToWrite, (err, data) => {
    if (err) {
      throw new Error(err);
    } else {
      console.log("Design system updated successfully!");
      if (toCompile) {
        compileToCss();
      }
    }
  });
}

function compileToCss() {
  console.log("\n\n--------Compiling To CSS------------\n\n");

  child_process.exec(
    "node-sass styles.scss styles.css",
    (error, stdout, stderr) => {
      if (error) {
        throw new Error(error);
      } else {
        console.log("Compilation Complete!");
      }
    }
  );
}

// compile all recognized folders
compileFolder("abstracts");
compileFolder("base");
compileFolder("components");
compileFolder("layout");

// write to scss file
writeToFile("styles.scss", true);
