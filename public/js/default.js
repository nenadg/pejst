// IE trickery PARTIALLY included, expect errors!
"use strict";

document.addEventListener("DOMContentLoaded", function(e){
    document.removeEventListener( "DOMContentLoaded", e.callee, false );
    
    app.init();
});
        
var app = (function(){
 
    var chars, lines, words, rows, cols, line, textarea, text, word, ul, li, typing;
    var event = (window.navigator.userAgent.match(/chrome/gi))? 'keydown' : 'keypress'; // for some reason chrome doesn't accept keypress for some keys
    
    // _p :: picnic lazy function
    // pass one attribute - get element
    // pass two attributes - get element's value
    // pass three attributes - set element's attribute value
    function _p(elem, attr, val){
        
        var element = document.getElementsByTagName(elem)[0] || document.getElementById(elem);
        
        if(element)
            if(attr)
                if(val)
                    element.setAttribute(attr, val);
                else
                    return element.getAttribute(attr);
            else   
                return element;
        else
            throw new Error('moo... element "' + elem + '" doesn\'t exist.')
    }
    
    // generate short hash of text input
    function hash(t){
        
        var ext = t.replace(/[^\w\s]/gi, ''), h = 0, str = '';
        
        for (var i = 0; i < ext.length; i++) { h = ext.charCodeAt(i) + ((h << 5) - h) } 
        
        return (0x100000000 | (h<<16) | (h<<8) | h).toString(16).slice(1) || '';

    }

    function count(e){
        
        text = textarea.value;
        line = (text.match(/\n/g)||[]).length;
        word = (text.match(/\S+/g)||[]).length;
        
        chars.innerHTML = text.length;
        lines.innerHTML = line +1;
        words.innerHTML = word;
        
        // add new lines when bottom is reached
        if(line >= rows || ((rows -1) >= line && rows > 19))
            _p('textarea', 'rows', line + 2);
        
        // add numeration according to number of lines
        while(li.length -1 <= line)
            ul.innerHTML += '<li></li>';
        
        // (textarea.offsetWidth - 20) / text.length <= 8.5 : don't forget the resolutions
                  
        if(e){
        
            var caretPosition = text.substr(0, textarea.selectionStart).split("\n").length;
            
            // remove highlight when line becomes accessible
            if(e.keyCode === 13){
                if(li[caretPosition -1].style.backgroundColor != '')
                    li[caretPosition -1].style.backgroundColor = '#efefef'; }
            
            // remove line numbers 
            else if(e.keyCode === 8 && text.split('\n')[line] == ''){
                var toRemove = [];
                
                // mark unreachable lines (occures when ctrl+a delete, etc.) for deletion
                for(var item = 0; item <= li.length -1; item++)
                    if(item > (caretPosition -1))
                        toRemove.push(li[item]);
                
                // kill 'em all
                for(var dead in toRemove)
                    ul.removeChild(toRemove[dead]);
                
                // highligth last (unaccessible) child 
                if(li.length > line && li.length >1)    
                    ul.lastChild.style.background = '#dfdfdf';
            }
        }
    }
    
    function load(){
        
        count();
        
        //console.log(textarea.getClientRects());//.offsetWidth);
    }
    
    function init(){
    
        textarea = _p('textarea');
        ul = _p('ul');
        li = ul.getElementsByTagName('li');
        chars = _p('chars');
        lines = _p('lines');
        words = _p('words');
        rows = _p('textarea', 'rows');
        cols = _p('textarea', 'cols');
      
        textarea.addEventListener(event, function(e){
            (!e)? count(window.event): count(e);          
        });
        
        textarea.addEventListener('keyup', function(e){
            
            // generate short url 
            var hashed = hash(textarea.value);
            
            // after you stop typing for few seconds
            clearTimeout(typing);
            
            typing = setTimeout(function(){
                window.history.pushState('', '', '/#' + hashed);
            }, 2000);
            
        });
        
        load();
    }
    
    return {
        init: init
    };

})();
