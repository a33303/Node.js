const http = require('http');
const path = require('path');
const fs = require('fs');
const worker_threads = require('worker_threads');



(async () => {
  const isFile = (path) => fs.lstatSync(path).isFile();
  const counterUser = (client) => {
    return new Promise(((res, rej) =>{
      const worker = new worker_threads.Worker('./worker.js', {
        workerData: client,
      })
      worker.on('message', res)
      worker.on('error', rej)
    }))
  }
  http.createServer( (req, res) => {
    // console.log(req.url);
    const fullPath = path.join(process.cwd(), req.url);
    // console.log(fullPath);
    if (!fs.existsSync(fullPath)) return res.end('File or directory not found');

    if (isFile(fullPath)) {
      return fs.createReadStream(fullPath).pipe(res);
    }

    let linksList = '';

    // advanced
    const urlParams = req.url.match(/[\d\w\.-]+/gi);
    console.log(urlParams);

    if (urlParams) {
      urlParams.pop();
      const prevUrl = urlParams.join('/');
      linksList = urlParams.length ? `<li><a href="/${prevUrl}">..</a></li>` : '<li><a href="/">..</a></li>';
    }

    fs.readdirSync(fullPath)
      .forEach(fileName => {
        const filePath = path.join(req.url, fileName);
        console.log(filePath);
        linksList += `<li><a href="${filePath}">${fileName}</a></li>`;
      });

    const HTML = fs
      .readFileSync(path.join(__dirname, 'homework5.html'), 'utf-8')
      .replace('##links', linksList);

    res.writeHead(200, {
      'Content-Type': 'text/html',
    });

    fetch('./homework5')
      .then(res =>{
        return res.json();
      })
      .then(data =>{
        counter = data.counter;
        let doc = document.querySelector('.info');
        doc.append(`Вы по счету ${counter}`);
      });

    return res.end(HTML);
  }).listen(5555);
})();
