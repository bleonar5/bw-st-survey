const allUrls = require('../bin/urls');

module.exports = 

function getPageNumber(_url) {
    for (let i = 0; i < allUrls.length; i++) 
    {
        if (allUrls[i].url === _url) 
        {
            return allUrls[i].page;
        }
    }
}