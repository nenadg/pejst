;(function(){
    
    var chars, lines, words, rows, cols, line, textarea, text, word, ulist, list;
    var events = [ 'keyup', 'keydown', 'keypress' ];
    
    function e(elem, attr, val){
        
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
            throw new Error('moo...')
    }
    
    function numerate(evt){
        
        var caretPosition = text.substr(0, textarea.selectionStart).split("\n").length;
            
        // remove highlight when line becomes accessible
        if(evt.keyCode == '13'){
            if(list[caretPosition -1].style.backgroundColor != '')
                list[caretPosition -1].style.backgroundColor = '#efefef'; }
        
        // remove line numbers 
        else if(evt.keyCode == '8' && text.split('\n')[line] == ''){
            var toRemove = [];
            
            // mark unreachable lines (occures when ctrl+a delete, etc.) for deletion
            for(var item = 0; item <= list.length -1; item++)
                if(item > (caretPosition -1))
                    toRemove.push(list[item]);
            
            // kill 'em all
            for(var dead in toRemove)
                ulist.removeChild(toRemove[dead]);
            
            // highligth last (unaccessible) child 
            if(list.length > line && list.length >1)    
                ulist.lastChild.style.background = '#dfdfdf';
        }
    }

    function count(){
        
        text = textarea.value;
        line = (text.match(/\n/g)||[]).length;
        word = (text.match(/\S+/g)||[]).length;
        
        chars.innerHTML = text.length;
        lines.innerHTML = line +1;
        words.innerHTML = word;    
        
        // add new lines when bottom is reached
        if(line >= rows || ((rows -1) >= line && rows > 19))
            e('textarea', 'rows', line + 2);    
        
        // add numeration according to number of lines
        while(list.length -1 <= line)
            ulist.innerHTML += '<li></li>';
    }
    
    return setTimeout(function(){
        
        textarea = e('textarea');
        ulist = e('ul');
        list = ulist.getElementsByTagName('li'); 
        chars = e('chars');
        lines = e('lines');
        words = e('words');  
        rows = e('textarea', 'rows');
        cols = e('textarea', 'cols');
        text = textarea.value;
        
        e('textarea').addEventListener('keypress' , function(evt){
            count(); 
            (!evt)? numerate(window.event): numerate(evt);
            
        });

        count();
    }, 100);

})();
