import path from "path"
import fs from 'fs';

// Generates JSON for the M3taloot Avatar Creator (or elsewhere)

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

const foundFiles = readDirRecursive(p, (path) => { return !path.includes('node_modules') }).filter(str => str.includes('glb'));
console.log(foundFiles);

let lastTrainName = '';
const json = [];
// for each file in foundFiles, start a new child process
// that will take a screenshot of the file using the "screenshot-glb" command
foundFiles.forEach(file => {
    const folderArray = file.split('/');

    // get the second (-2) to last value of folderArray
    const traitName = folderArray[folderArray.length - 3];


    // get the file name and replace _ with spaces
    const itemName = file.split('/').pop();
    const capitalize = str => str.split(' ').map(sub => sub.charAt(0).toUpperCase() + sub.slice(1)).join(' ');

    const collection = {
        id: traitName + "-" + itemName.split('.')[0],
        name: capitalize(itemName.replace(/_/g, ' ')).replace('.glb', ''),
        directory: file,
        thumbnail: file.replace('glb', 'jpg')
    }

    // if the folder is different than the last folder, create a new object in the json
    if (traitName !== lastTrainName) {
        json.push({
            "trait": traitName,
            "type": "mesh",
            "collection": [collection]
        });
        console.log("folder !== lastFolder")
    } else {
        // if the folder is the same as the last folder, add the collection to the last object in the json
        json[json.length - 1].collection.push(collection);
        console.log("pushing to collection")
    }
    lastTrainName = traitName;
});

// write json to output.json
const output = JSON.stringify(json, null, 2);
const outputPath = __dirname + '/loot.json';
const outputFile = fs.createWriteStream(outputPath);
outputFile.write(output);