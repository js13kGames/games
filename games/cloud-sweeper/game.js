var myGamePiece;

function loadScript(url, callback)
{
    // Adding the script tag to the head
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Load
    head.appendChild(script);
}

loadScript("models.js");
loadScript("engine.js")
