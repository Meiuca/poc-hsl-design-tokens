const fs = require('fs');

function getDirectories(dirPath){
    return fs.readdirSync(__dirname + dirPath).map(file => {
        return file;
    });
}

module.exports = {
    getDirectories
}