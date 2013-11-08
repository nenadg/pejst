// IE trickery PARTIALLY included, expect errors!

;(function(){
    "use strict";
    
    var chars, lines, words, rows, cols, line, textarea, text, word, ul, li;
    var event = (window.navigator.userAgent.match(/chrome/gi))? 'keydown' : 'keypress'; // for some reason chrome doesn't accept keypress for some keys
    
    // _p :: picnic lazy function
    // pass one attribute - get element
    // pass two attributes - get element's value
    // pass three attributes - set element's value
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
    
    return setTimeout(function(){

        textarea = _p('textarea');
        ul = _p('ul');
        li = ul.getElementsByTagName('li');
        chars = _p('chars');
        lines = _p('lines');
        words = _p('words');
        rows = _p('textarea', 'rows');
        cols = _p('textarea', 'cols');
        text = textarea.value;
      
        textarea.addEventListener(event, function(e){
            (!e)? count(window.event): count(e);          
        });

        count();
    }, 100);

})();
