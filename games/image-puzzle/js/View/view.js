/**
	@author: Peda Venkateswarlu Pola
	Email : pola.venki@gmail.com
	YIM : pola_venki  Gtalk : pola.venki  Skype : pola.venki
*/
;(function(w,s){
	
	s.v.addHandler = function(){
		if (window.addEventListener ){
			return function(target,eventName,handlerName){
				target.addEventListener(eventName, handlerName, false);
			};
		}else if(window.attachEvent){
			return function(target,eventName,handlerName){
				target.attachEvent("on" + eventName, handlerName);
			};
		}
		
	}();
	
	s.v.removeHandler = function(){
		
		if (window.removeEventListener ){
			return function(target,eventName,handlerName){
				 target.removeEventListener(eventName, handlerName, false);
			};
		}else if(window.attachEvent){
			return function(target,eventName,handlerName){
				 target.detachEvent("on" + eventName, handlerName);
			};
		}
	     
	}();
	
	s.v.createEl = function(tagName, attr){
		if(typeof tagName != "string")
			return null;
		var node = document.createElement(tagName);
		if(attr){
			if(attr.id) node.id = attr.id;
			if(attr.className) node.className = attr.className;
			if(attr["class"]) node.className = attr["class"];
			if(attr.title) node.title = attr.title;
			if(attr.type) node.type = attr.type;
			if(attr.value) node.value = attr.value;
			if(attr.cssText) node.cssText = attr.cssText;
			if(attr.alt) node.alt = attr.alt;
			if(attr.src) node.src = attr.src;
			if(attr.html) node.innerHTML = attr.html;
			if(attr.align) node.align = attr.align;
			if(attr.text) p.View.text(node, attr.text);
			if(attr.name) node.name = attr.name;
			if(attr.tabIndex) node.tabIndex = attr.tabIndex;
		}		
		return node; 
	};
	
	
	
	
	s.v.stopEventPropogation = function(e){
		if(e && e.stopPropagation) e.stopPropagation();
		if (e) e.cancelBubble = true;
	};
	
	s.v.cancelEvent = function(e) {
	    if (typeof e.preventDefault == "function") e.preventDefault();
	    else e.returnValue = false;
	};
	
	
	
	s.v.getEl = function(elementID){	//custom DOM getElementById		
		return document.getElementById(elementID);
	};
	
	s.v.hasClass = function(ele, cls) {
		if(!ele) return;
		
		if(ele.classList) return ele.classList.contains(cls);
		return (" " + ele.className + " ").indexOf(" "+cls+" ") > -1;
	};
	
	s.v.addClass = function(ele, cls) {
		if(!ele) return;
		
		if(ele.classList) return ele.classList.add(cls);
		if (!s.v.hasClass(ele, cls)) {
			ele.className = s.v.getTrimString(ele.className + " " + cls);
		}
	};
	
	s.v.setClass = function(ele, cls) {
		ele.className = cls;
	};
	
	s.v.removeClass = function(ele, cls) {
		if(!ele) return;
		
		if(ele.classList) return ele.classList.remove(cls);
		
		if (s.v.hasClass(ele, cls)) {
			ele.className = s.v.getTrimString(ele.className.replace(new RegExp("(^|\\s)" + cls + "(\\s|$)"), " "));
		}
	};
	s.v.getTrimString = function(st){
		if(st){
			var re = /^\s+|\s+$/g;
		    return st.replace(re, "");
		}else return "";
	};
	
	s.v.addHandler(w,"load",function(){
		s.timerDiv = s.v.getEl("timeElapsed");
		if(!('ontouchstart' in document.documentElement) && s.isMobile) 
			alert("Your mobile web browser is not HTML5 touch compatible, Dragging feature wouldn't work");
		s.attachDragNDrop();
	});
	
})(window,slider);