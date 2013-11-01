;(function(){

    var chars, lines, words, rows, line, textarea, text, word;
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

    function count(){
        text = textarea.value;
        line = (text.match(/\n/g) != null)? text.match(/\n/g).length + 1 : 1;
        word = (text.match(/\S+/g) != null)? text.match(/\S+/g).length : 0;
        
        chars.innerHTML = text.length || 0;
        lines.innerHTML = line || 1;
        words.innerHTML = word || 0;   

        if((line + 1) >= rows || ((rows -2) >= line && rows > 19))
            e('textarea', 'rows', line + 2);
    }
    
    return setTimeout(function(){

        textarea = e('textarea');
        chars = e('chars');
        lines = e('lines');
        words = e('words');  
        rows = e('textarea', 'rows');   
        
        for(var event in events)
            e('textarea').addEventListener(events[event], count, false);  
        
        count();
    }, 100);

})();
