var texts, currentLine, currentRows;

$(document).ready(function(){
    currentRows = $("textarea").attr('rows');
    //texts = $("textsarea").val();
    
    //currentLine = (!currentString)? 1: currentString.match(/\n/g).length;
    
    $("#chars").append(0);
    $("#lines").append(1);
    
    $("textarea").bind('keydown keyup mouseenter mouseleave', stuff);
    

});

function stuff(){
    
        texts = $("textarea").val();
             
        currentLine = (texts.match(/\n/g) != null)? texts.match(/\n/g).length + 1 : 1;
        
        $("#chars").html(texts.length || 0);        
        $("#lines").html(currentLine);
        
        
        if ((currentLine +1) >= currentRows){
            currentRows = currentLine + 2;
            $("textarea").attr('rows', parseInt(currentRows));
            
            
            //var newheight = $("textarea").height($("textarea").height() + 40);
            //$("textarea").css('height', newheight);
        } else if((currentRows -2) >= currentLine && currentRows > 19) {
        
           currentRows = currentLine + 2;
           $("textarea").attr('rows', parseInt(currentRows));
        }
        
}
