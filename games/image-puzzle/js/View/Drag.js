/**
	@author: Peda Venkateswarlu Pola
	Email : pola.venki@gmail.com
	YIM : pola_venki  Gtalk : pola.venki  Skype : pola.venki
*/
(function(w, s) {
	
	var Drag = function(ele, callback, contextDoc, dragData , amIDraggable){
	
		var self = this;
		this.callback = callback;
		this.ele = ele;
		this.doc = contextDoc || w.document;
		this.dragStarted = false;
		this.mouseIsDown = false;
		this.dragSourceId = null;
		this.dropTargetId = null;
		this.dragData = dragData;
		this.dragThreshold = 5;	//mouse should move minimum this distance before we declare drag.
		
		
		var getTargetEle = function(e){
			
			var ele;
			if (e.touches && e.touches.length) { 
				ele = e.touches[0].target;
			} else {
				ele = (e.target || e.srcElement);
			}
			return ele;
		};
		
		var getTargetId = function(e) {
			var id;
			if (e.touches && e.touches.length) { 
				id = e.touches[0].target.id;
			} else {
				id = (e.target || e.srcElement).id;
			}
			return id;
		};
		
		var getCoors = function(e) {
			var coors = [];
			if (e.touches && e.touches.length) { 
				coors[0] = e.touches[0].pageX;
				coors[1] = e.touches[0].pageY;
				coors[2] = e.touches[0].clientX;
				coors[3] = e.touches[0].clientY;
			} else {
				coors[0] = e.pageX;
				coors[1] = e.pageY;
				coors[2] = e.clientX;
				coors[3] = e.clientY;
			}
			
			return coors;
		};
		
		
		this.touchHandler = function(event){
			var touches = event.changedTouches;
			if(touches.length > 1){
				return false; // No need to react upon multi touch.
			} 
			switch(event.type){
				case "touchstart" :  self.onMouseDown(event); break;
				case "touchmove"  :  self.onMouseMove(event); break;	
				case "touchend"  :  self.onMouseUp(event); break;
				case "touchcancel"  : self.onMouseUp(event,true); break;
			} 
		};
		
		
		this.onMouseDown = function(e){
			e = window.event || e;
			var coors = getCoors(e);
			
			self.startX = self.lastX = coors[0];
			self.startY = self.lastY = coors[1];
			
			if (e.type === 'touchstart') {
				s.v.removeHandler(ele, "mousedown", self.onMouseDown); // Not needed as the firsttouch is triggered
				s.v.addHandler(ele, "touchmove", self.touchHandler);
				s.v.addHandler(ele, "touchend", self.touchHandler);
				s.v.addHandler(document.body, "touchcancel", self.touchHandler);
			}else{
				var leftClick = e.which || e.button;
				if(leftClick != 1)return;
				
				if(self.mouseIsDown) return;	//this can happen, especially in IE
				self.mouseIsDown = true;
			
				s.v.addHandler(self.doc, "mousemove", self.onMouseMove);
				s.v.addHandler(self.doc, "mouseup", self.onMouseUp);
				s.v.addHandler(self.doc, "blur", self.onMouseUp);	//do we need to hook 'selectstart' also?
				s.v.cancelEvent(e);
				s.v.stopEventPropogation(e);
			}
			self.targetEle = getTargetEle(e);
			self.doCallback("mousedown");
			
			
		};
		
		this.onMouseUp = function(e,isDragCanceled){
			self.mouseIsDown = false;
			e = window.event || e;
			if (e.type === 'touchend' || e.type === 'touchcancel') {
				s.v.removeHandler(ele, "touchmove", self.touchHandler);
				s.v.removeHandler(ele, "touchend", self.touchHandler);
				s.v.removeHandler(document.body, "touchcancel", self.touchHandler);
			}else{
				s.v.removeHandler(self.doc, "mousemove", self.onMouseMove);
				s.v.removeHandler(self.doc, "mouseup", self.onMouseUp);
				s.v.removeHandler(self.doc, "blur", self.onMouseUp);
				s.v.cancelEvent(e);
				s.v.stopEventPropogation(e);
			}
			self.dropTargetId = getTargetId(e);
			if(self.dragStarted) isDragCanceled ? self.doCallback("dragcancel") : self.doCallback("dragend",{"droppedEleId" : self.dropTargetId , "droppedOnMySelf" : (self.dragSourceId===self.dropTargetId)});
			self.dragStarted = false;
			
		};
		
		this.onMouseMove = function(e){
			e = window.event || e;
			
				
			var coors = getCoors(e);
			
			self.lastX = coors[0];
			self.lastY = coors[1];
			self.clientX = coors[2];
			self.clientY = coors[3];
			
			if(s.isIE && e.button == 0 && !window.performance) return self.onMouseUp();	//avoid glitches in IE 7/8
			if(!self.dragStarted) var threshold = Math.max(Math.abs(self.startX - self.lastX), Math.abs(self.startY - self.lastY));
			
			
			if(!self.dragStarted && threshold >= self.dragThreshold){
				self.dragStarted = true;
				self.doCallback("dragstart");
				self.dragSourceId = getTargetId(e);
				
			}else if(!self.dragStarted){
				return s.v.cancelEvent(e);	//ignore mouse move till we reach threshold
			}
			if (e.type === 'mousemove') {
				s.v.cancelEvent(e);
				s.v.stopEventPropogation(e);
			}
			self.doCallback("drag");
		};
				
		this.doCallback = function(eventName,data){
			if(self.callback && typeof self.callback == "function"){
				self.callback.call(self.ele, eventName, {"startX": self.startX, "lastX": self.lastX, "startY": self.startY, "lastY": self.lastY,"clientX" : self.clientX,"clientY" : self.clientY} , data,self.targetEle);
			}
		};
		
		s.v.addHandler(ele, "mousedown", function(e){
			amIDraggable() && self.onMouseDown(e);
		});
		s.v.addHandler(ele, "touchstart", function(e){
			amIDraggable() && self.onMouseDown(e);
		}); // Both mousedown and touchstart needed to make touchstart fast
		s.v.addHandler(document.body, "touchmove", function(event) {event.preventDefault();}); 
	};

	
	s.v.Drag = Drag;
	
})(window,slider);