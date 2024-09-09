var time=function(){function n(){return Date.now()-w}function o(n,o,e,r){var t=Date.now()-n,i=t-o
w=i,"function"==typeof r&&r()}function e(){return window.performance.now()}var r=Date.now(),t=window.performance.now(),w=0
return{now:n,parse:o,micro:e,set serverTime(n){t=window.performance.now(),r=n}}}()
