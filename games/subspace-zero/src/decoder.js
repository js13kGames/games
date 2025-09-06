var blobArr=[];const mimeType='image/png';function DecomSpr(data,size,cvs,l){sD=data.split(",");w=sD[0];h=sD[1];bin=[];rows=[];br='';for(var i=2;i<sD.length;i++){hex=hexToBinary(sD[i]);bin[bin.length]=hex}
  for(var j=0;j<bin.length;j++){for(var k=0;k<bin[j].length;k++){br+=bin[j].charAt(k);if(br.length==w){rows.push(br);br=''}}}
  cvs.width=w*size;cvs.height=h*size;var c=SelectColor(l);DrawToCvs(cvs.getContext("2d"),size,rows,c)}
function SelectColor(l){return(l==46?('#FFFFFF22'):l==47?('#FFFFFF99'):null)}
function DrawToCvs(ctx,size,rows,col){if(col){ctx.fillStyle=col}else{ctx.fillStyle=cR[0]}
  currX=0;for(var i=0;i<rows.length;i++){pixels=rows[i];currY=0;for(var y=0;y<pixels.length;y++){row=pixels[y];for(var x=0;x<row.length;x++){if(row[x]==1){ctx.fillRect(currY+y*size,currX,size,size)}}}
    currY+=size;currX+=size}}
function CvstoImData(cnv,num){cntxt=cnv.getContext("2d");imageData=cntxt.getImageData(0,0,cnv.width,cnv.height);cnv.toBlob((blob)=>{const reader=new FileReader();reader.addEventListener('loadend',()=>{const arrayBuffer=reader.result;const blob=new Blob([arrayBuffer],{type:mimeType});blobArr[num]=blob;if(blobArr.length==tl.length){isProc=!0}});reader.readAsArrayBuffer(blob)},mimeType)}