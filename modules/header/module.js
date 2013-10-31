// parses header.json file in search for css and js includes
// for html page

var fs = require('fs'),
    path = require('path');

exports.header = function(name, next){
    var styles = '',
        scripts = '';
    
    fs.readFile(path.join(__dirname, '../../shared/header.json'), 'utf8', function (err, data) {
        if (!err) {

            data = JSON.parse(data);

            for(var style in data[name].styles)
                styles += '<link rel=\"stylesheet\" type=\"text/css\" href=\"/css/' + data[name].styles[style] + '\" />\n\t';

            for(var script in data[name].scripts){

                if(data[name].scripts[script].constructor === Object)
                    scripts += '<script src=\"' + data[name].scripts[script].url + '\"></script>\n\t';
                else
                    scripts += '<script src=\"/js/' + data[name].scripts[script] + '\"></script>\n\t';
            }
          
          next(styles + scripts);
          
      } else {
            throw new Error('Error occured ' + err);
            next(null);
        }
    });
    
};
