// myalert.js 
//050912 - closealertbox() now includes an optional doafterclose() call 
// allows optional doafterclose() in main html file
//Alertbox Replacement using javascript 28-06-06 author mike capstick
//     alertsetup();  //set up alertbox html and add to webpage
//     alertboxer(message); //where message is html to be displayed in alertbox
// the messages are stored in js inside relevant html page
//     closealertbox()   // close alertbox

function alertsetup(){
  // setup alertboxcontainer div with id using dom methods then populate it with slack .innerHTML method
  a = document.createElement("div");        //create div
  a.setAttribute("id","alertboxcontainer"); //set id
  document.body.appendChild(a);             // add to body
  // now add contents of alertbox
  divcode="<div id='alertbox'><div id='aboxtitle'>"+aboxtitle +"</div><div id='alertboxtext'>.</div>";
  divcode=divcode+"<a href='javascript:void(0);' id='alertbutton' onclick='closealertbox();'>OK</a></div>"
  document.getElementById('alertboxcontainer').innerHTML=divcode;
}
function alertboxer(x){
// first turnoff  'show thru select boxes'
   // create an array of the select elements
   selectarray=document.getElementsByTagName('select');
    // hide select tags
   for (i=0;i<selectarray.length;i++)
        {selectarray[i].style.visibility='hidden';}
  
   // set container to whole screen so we can cover it with the transparent gif
   document.getElementById('alertboxcontainer').style.width=document.body.clientWidth+'px';
   document.getElementById('alertboxcontainer').style.height=document.body.clientHeight+'px';
   
   document.getElementById('alertbox').style.display='block';
   document.getElementById('alertbox').style.top=50+'px';
   document.getElementById('alertbox').style.left=(document.body.clientWidth-300)/2+'px';
   document.getElementById('alertbox').style.display='block';
   document.getElementById('alertboxtext').innerHTML=x;

//   document.body.style.filter = 'alpha(opacity=50)';
//   document.body.style.MozOpacity='.5'  // - also 'hides' alertbox
//   document.getElementById('alertbox').style.MozOpacity=1
}

function closealertbox(){
    // show invisible select tags
   for (i=0;i<selectarray.length;i++)
        {selectarray[i].style.visibility='visible';}
   document.getElementById('alertboxcontainer').style.width=0+'px';
   document.getElementById('alertboxcontainer').style.height=0+'px';
   document.getElementById("alertbox").style.display="none"
   //document.body.style.filter = 'alpha(opacity=' +255 + ')';
   
   // allow for any additional function which may not exist following ok button click
   try     {doafterclose();}
   catch(e){} //just ignore call as doafterclose(); doesn't exist
}

// function doafterclose(){alert('test');}
// place in main html file if used