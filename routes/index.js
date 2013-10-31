var header = require('../modules/header/module').header;

exports.index = function(req, res){
    var name = module.filename.slice(__filename.lastIndexOf('/')+1, module.filename.length);
    
    header(name, function(header){
        
        res.render('index', { 
                title: 'pejst',
                header: header,
                layout: 'layout' /* this is default, just left this line as a note */ });
    });
};
