const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

async function minifyFile(filePath) {
    const code = fs.readFileSync(filePath, 'utf8');
    const result = await minify(code);
    const outputFilePath = path.join(path.dirname(filePath), path.basename(filePath).replace('.js', '.min.js'));
    fs.writeFileSync(outputFilePath, result.code);
}

async function run() {
    const dirPath = "docs/assets/js/";
    fs.readdir(dirPath, (err, files) => {
        if (err) {
            return console.error("Failed to scan directory: ", err);
        }
        files.forEach(async (file) => {
            const filePath = path.join(dirPath, file);
            // console.log(filePath);
            if (path.extname(filePath) === '.js' && !filePath.endsWith('.min.js')) {
                await minifyFile(filePath);
            }
        });
    });
}

run();
