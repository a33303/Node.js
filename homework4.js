const fs = require('fs/promises');
const {lstatSync} = require('fs');
const inquirer = require('inquirer');
const yargs = require('yargs');
const path = require('path');

//let executionDir = process.cwd();
//const isFile = (fileName) => fs.lstatSync(fileName).isFile();
//const list = fs.readdirSync('./').filter(isFile);

let currentDir = process.cwd();
const options = yargs
  .positional('d', {
    describe: 'Путь к каталогу',
    default: process.cwd()
  })
  .positional('p', {
    describe: 'Паттерн',
    default: ''
  }).argv;

class ListItem {
  constructor(path, fileName) {
    this.path = path;
    this.fileName = fileName;
  }
  get listDirectory() {
    return lstatSync(this.path).isDirectory();
  }
}

const run = async () =>
{
  const list = await fs.readdir(currentDir);
  const items = list.map (fileName =>
    new ListItem(path.join(currentDir, fileName), fileName));

  const item = await inquirer
    .prompt([
      {
        name: 'listItem',
        type: 'list',
        message: `Выберите: ${currentDir}`,
        choices: items.map(item => ({ name: item.fileName, value: item })),
      },
    ])
    .then(answer => answer.listItem);

  if (item.listDirectory) {
    currentDir = item.path;
    return await run();
  } else {
    const data = await fs.readFile(item.path, 'utf-8');

    if (options.p == null) console.log(data);
    else {
      const regExp = new RegExp(options.p, 'igm');
      console.log(data.match(regExp));
    }
  }
}

/*
inquirer.prompt([
  {
    name: 'fileName',
    type: 'list', // input, number, confirm, list, checkbox, password
    message: 'Выберите файл для чтения',
    choices: list,
  },
])
  .then(({ fileName }) => {
    const fullPath = path.join(executionDir, fileName);

    fs.readFile(fullPath, 'utf-8', (err, data) => {
      if (err) console.log(err);
      else console.log(data);
    });
  });

*/
run();

