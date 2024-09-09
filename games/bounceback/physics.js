// function xy(x,y){
// 	return {x:x,y:y};
// }
function elasticcollide(v1,m1,v2,m2){
	var v0=2*(v1*m1+v2*m2)/(m1+m2);
	return {v1:v0-v1,v2:v0-v2};
}
function circlecollide(v1,x1,y1,m1,v2,x2,y2,m2){
	var i1={x:x1-x2,y:y1-y2},i2,i3,i4,i5,i6;
	if(i1.x*i1.x+i1.y*i1.y<0.0000000001)console.warn(`too close!`);
	// i2=1/Math.sqrt(i1.x*i1.x+i1.y*i1.y);
	// i1.x*=i2;i1.y*=i2;
	i2=v1.x*i1.x+v1.y*i1.y;
	i3=v2.x*i1.x+v2.y*i1.y;
	i4=elasticcollide(i2,m1,i3,m2);
	i4.v1-=i2;i4.v2-=i3;
	i2=1/(i1.x*i1.x+i1.y*i1.y);
	i4.v1*=i2;i4.v2*=i2;
	i5={x:v1.x+i4.v1*i1.x,y:v1.y+i4.v1*i1.y};
	i6={x:v2.x+i4.v2*i1.x,y:v2.y+i4.v2*i1.y};
	return {v1:i5,v2:i6};
}

function MovingCirc(x=0,y=0,vx=0,vy=0,r=1,fixed=false){
	return {x:x,y:y,v:{x:vx,y:vy},r:r,fixed:fixed};
}
function testCircleOverlap(x1,x2){
	return (x1.x-x2.x)**2+(x1.y-x2.y)**2<(x1.r+x2.r)**2;
}
function testCircleCollide(x1,x2){
	if((x1.x-x2.x)**2+(x1.y-x2.y)**2>(x1.r+x2.r)**2)return false;
	return (x1.x-x2.x)*(x1.v.x-x2.v.x)+(x1.y-x2.y)*(x1.v.y-x2.v.y)<0;
}

//wall
function FixedRect(x,y,halfwidth,halfheight,ang=0){
	return {x:x,y:y,a:halfwidth,b:halfheight,ang:ang};
}
function testCornerCircCollide(x,y,a,b,co,si,x1){
	// var si=Math.sin(ang),co=Math.cos(ang);
	var i1=(x1.x-x)*co+(x1.y-y)*si,i2=(x1.y-y)*co-(x1.x-x)*si;
	if((i1-a)*a<0||(i2-b)*b<0)return false;
	var i3=x+a*co-b*si-x1.x,i4=y+a*si+b*co-x1.y;
	return (i3*i3+i4*i4<=x1.r*x1.r)&&(i3*x1.v.x+i4*x1.v.y>0);
}
function testEdgeCircCollide(x,y,a,b,co,si,x1){
	// var si=Math.sin(ang),co=Math.cos(ang);
	if(x1.v.x*co+x1.v.y*si>0)return false;
	var i1=(x1.x-x)*co+(x1.y-y)*si,i2=(x1.y-y)*co-(x1.x-x)*si;
	if(i1<0||i1>a+x1.r)return false;
	if(i2>=b||i2<=-b)return false;
	if(i1<=a){//true if center in triangle
		return Math.abs(i2)*a<b*i1;
	}
	//i1>a,|i2|<b
	return true;
}
function testRectCircCollide(x0,x1){
	if((x0.x-x1.x)**2+(x0.y-x1.y)**2>(x0.a+x0.b+x1.r)**2)return false;//prune
	var co=Math.cos(x0.ang),si=Math.sin(x0.ang);
	if(testCornerCircCollide(x0.x,x0.y,x0.a,x0.b,co,si,x1))return true;
	if(testCornerCircCollide(x0.x,x0.y,-x0.a,x0.b,co,si,x1))return true;
	if(testCornerCircCollide(x0.x,x0.y,x0.a,-x0.b,co,si,x1))return true;
	if(testCornerCircCollide(x0.x,x0.y,-x0.a,-x0.b,co,si,x1))return true;
	return (testEdgeCircCollide(x0.x,x0.y,x0.a,x0.b,co,si,x1))||
	(testEdgeCircCollide(x0.x,x0.y,x0.a,x0.b,-co,-si,x1))||
	(testEdgeCircCollide(x0.x,x0.y,x0.b,x0.a,-si,co,x1))||
	(testEdgeCircCollide(x0.x,x0.y,x0.b,x0.a,si,-co,x1));
}
function reflectvec(co,si,v1){
	// console.info(co,si,v1);
	var i1=2*(v1.x*co+v1.y*si);
	return {x:v1.x-i1*co,y:v1.y-i1*si};
}
function workRectCircCollide(x0,x1){
	if((x0.x-x1.x)**2+(x0.y-x1.y)**2>(x0.a+x0.b+x1.r)**2)return false;//prune
	var co=Math.cos(x0.ang),si=Math.sin(x0.ang);
	var a=x0.a,b=x0.b;
	// console.log(co,si);
	if(testCornerCircCollide(x0.x,x0.y,a,b,co,si,x1)){
		let res=circlecollide({x:0,y:0},x0.x+a*co-b*si,x0.y+a*si+b*co,20190817,x1.v,x1.x,x1.y,1);
		x1.v=res.v2;
		return;
	}
	a=-a;
	if(testCornerCircCollide(x0.x,x0.y,a,b,co,si,x1)){
		let res=circlecollide({x:0,y:0},x0.x+a*co-b*si,x0.y+a*si+b*co,20190817,x1.v,x1.x,x1.y,1);
		x1.v=res.v2;
		return;
	}
	b=-b;
	if(testCornerCircCollide(x0.x,x0.y,a,b,co,si,x1)){
		let res=circlecollide({x:0,y:0},x0.x+a*co-b*si,x0.y+a*si+b*co,20190817,x1.v,x1.x,x1.y,1);
		x1.v=res.v2;
		return;
	}
	a=-a;
	if(testCornerCircCollide(x0.x,x0.y,a,b,co,si,x1)){
		let res=circlecollide({x:0,y:0},x0.x+a*co-b*si,x0.y+a*si+b*co,20190817,x1.v,x1.x,x1.y,1);
		x1.v=res.v2;
		return;
	}
	if(testEdgeCircCollide(x0.x,x0.y,x0.a,x0.b,co,si,x1)||testEdgeCircCollide(x0.x,x0.y,x0.a,x0.b,-co,-si,x1)){
		let res=reflectvec(co,si,x1.v);
		x1.v=res;
	}else if(testEdgeCircCollide(x0.x,x0.y,x0.b,x0.a,-si,co,x1)||testEdgeCircCollide(x0.x,x0.y,x0.b,x0.a,si,-co,x1)){
		let res=reflectvec(si,-co,x1.v);
		x1.v=res;
	}
	return;
}
