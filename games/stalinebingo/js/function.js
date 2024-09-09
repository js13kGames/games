/**
 * Function that can do ajax stuff 
 * @param {Object} fileName
 * @param {Object} method
 * @param {Object} callback
 * @return void
 */
function AjaxRequest (fileName, method, callback)
{
    var xmlhttp;

    xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function ()
    {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200 && typeof callback !== 'undefined' && callback !== null)
            callback(xmlhttp);
    }

    xmlhttp.open(method, fileName, true);
    xmlhttp.send();
}

/**
 * 
 * @param {Object} tag
 * @param {String} className
 * @param {Object} html
 * @param {Object} daddy
 * 
 * @return {Object} object html
 */
function addElement (tag, className, html, daddy)
{
    newElement = document.createElement(tag);
    newElement.innerHTML = html;
    newElement.setAttribute("class", className);
    daddy[0].appendChild(newElement);
    
    return newElement;
}
