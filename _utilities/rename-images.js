import path from "path"
import fs from 'fs';

// Simple utility to rename any jpeg files in the directory to be lower snake case

function readDirRecursive(root, filter, files, prefix) {
  prefix = prefix || ''
  files = files || []
  filter = filter || x[0] !== '.'

  var dir = path.join(root, prefix)
  if (!fs.existsSync(dir)) return files
  if (fs.statSync(dir).isDirectory())
    fs.readdirSync(dir)
    .filter(function (name, index) {
      return filter(name, index, dir)
    })
    .forEach(function (name) {
      readDirRecursive(root, filter, files, path.join(prefix, name))
    })
  else files.push(prefix)

  return files
}

const __dirname = path.resolve();
const p = __dirname + '/';

const foundFiles = readDirRecursive(p, (path) => { return !path.includes('node_modules') }).filter(str => str.includes('jpg'));

// for each file in foundFiles, start a new child process
// that will take a screenshot of the file using the "screenshot-glb" command
foundFiles.forEach(file => {
    // get the file name and replace spaces with _
    const itemName = file.split('/').pop();
    const newName = itemName.replace(/ /g, '_').toLowerCase();
    // rename the file
    fs.renameSync(file, file.replace(itemName, newName));
});
