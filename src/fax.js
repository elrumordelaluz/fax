(function(root, factory){

  if (typeof define === 'function' && define.amd) {
    define(function() {
      return factory(root);
    });
  } else if (typeof exports === 'object') {
    module.exports = factory;
  } else {
    root.fax = factory(root);
  }
  
})(this, function(root){

  'use strict';

  var fax = {};

  var callback = function () {};

  var elementToObject = function(source) {

    var elem = source.nodeType ? source : document.querySelector(source);

    var obj = {};

    // Check if is an element and not Text
    if(elem.nodeType == 1) {

      // Check for attributes
      if(elem.attributes.length > 0){

        obj['attrs'] = {};

        [].slice.call(elem.attributes).forEach(function(item) {
          obj['attrs'][item.name] = item.value;
        });

        if(elem.namespaceURI){
          obj['attrs']['ns'] = elem.namespaceURI;
        }

      } else {

        if(elem.namespaceURI){
          obj['attrs'] = {};
          obj['attrs']['ns'] = elem.namespaceURI;
        }

      }

    } else { // if text node
      obj = elem.nodeValue;
    }


    if(elem.hasChildNodes()){

      for (var i = 0; i < elem.childNodes.length; i++) {
        var item = elem.childNodes.item(i);
        var nodeName = item.nodeName;

        if(typeof obj[nodeName] == "undefined"){
          
          obj[nodeName] = elementToObject(item);

        } else {
          
          if(typeof(obj[nodeName].push) == "undefined"){
            var temp = obj[nodeName];
            obj[nodeName] = [];
            obj[nodeName].push(temp);
          }

          obj[nodeName].push(elementToObject(item));
        }

      };
    }

    return obj;

  } // elementToObject



  var objectToElement = function(obj, dest){

    var elem = dest.nodeType === 1 ? dest : document.querySelector(dest);

    for (var property in obj) {

      if (obj.hasOwnProperty(property) && property !== 'attrs') {
        
        try {
          var elm = document.createElement(property);
          if (typeof obj[property] == "object" && !(obj[property] instanceof Array) ){
            
            var ns =  obj[property]['attrs'] && obj[property]['attrs']['ns'] == 'http://www.w3.org/2000/svg' ? 'http://www.w3.org/2000/svg' : undefined;
            var newElm = ns ? document.createElementNS(ns, property) : document.createElement(property);
            objectToElement(obj[property], newElm);
            elem.appendChild(newElm)
            
          } else{

            for (var i = 0; i < obj[property].length; i++) {
              var ns = obj[property][i]['attrs'] && obj[property][i]['attrs']['ns'] == 'http://www.w3.org/2000/svg' ? 'http://www.w3.org/2000/svg' : undefined;
              var newElm = ns ? document.createElementNS(ns, property) : document.createElement(property);
              objectToElement(obj[property][i], newElm);
              elem.appendChild(newElm);
            };
            
          }
        }
        catch(e) { 
          
          if(typeof obj[property] == 'string'){
            var node = property == '#text' ? document.createTextNode(obj[property]) : document.createComment(obj[property]);
            elem.appendChild(node);
          } else if(obj[property] instanceof Array){
            for (var i = 0; i < obj[property].length; i++) {
              var node = property == '#text' ? document.createTextNode(obj[property][i]) : document.createComment(obj[property][i]);
              elem.appendChild(node);
            };
          }
          
        }
        
      } else {

        // Set Attributes
        for(var key in obj[property]) {
          
          if(key !== 'ns') {
            elem.setAttribute(key, obj[property][key]);   
          }
          
        }
        
      }

    } // for..in

  }  // objectToElement



  fax['toObject'] = function(elem) {
    return elementToObject(elem);
  }

  fax['toJson'] = function(elem) {
    return JSON.stringify(elementToObject(elem), null, 2);
  }

  fax['toElement'] = function(obj, dest) {
    return objectToElement(obj, dest);
  }

  fax['faxie'] = function(inputElem, outputElem, strict) {
    var tempElem, 
        parentElem,
        input = inputElem.nodeType ? inputElem : document.querySelector(inputElem),
        output = outputElem.nodeType === 1 ? outputElem : document.querySelector(outputElem);
        
    // If the input nodeName is !== to the output nodeName
    if(strict && input.nodeName !== output.nodeName){
      // Create a New Element with the same input nodeName and namespace
      tempElem = input.namespaceURI == 'http://www.w3.org/2000/svg' ? document.createElementNS('http://www.w3.org/2000/svg', input.nodeName)  : document.createElement(input.nodeName);
      // Get the Output parent
      parentElem = output.parentNode;
      // Replace the element
      parentElem.replaceChild(tempElem, output);
      // Assign the New Element to the output
      output = tempElem;
    }

    objectToElement(
      elementToObject(input), 
      output
    );
  
  }

  return fax;

});


// var test = fax.toObject('.section');
// fax.toElement(test, '#newStuff');
// fax.faxie('.section', '#test', true);




