/* -- FUNCTION FOR EXTRACTING URLs AND PAGE NUMBERS -- */
/* -
This works but pagination will be undefined if the element in the array is not present
This function will break if you put page 1 in as an argument
- */

module.exports =

function extractUrlAndPage(_page, _urlsArray) {
    
    let urlInfo = 
        {
            currentPage: _urlsArray[_page - 1].url,
            previousPage: _urlsArray[_page - 2].url,
            nextPage: _urlsArray[_page].url,
            pagination: _urlsArray[_page - 1].pagination,
            backbutton: _urlsArray[_page - 1].backbutton
        }
  
    return urlInfo;
  }