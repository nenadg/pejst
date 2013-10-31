var expressLayouts = require('express-ejs-layouts');
var path = require('path');
    
module.exports = function(app, express, redisdb){
    var redisstore = require('connect-redis')(express);
    
    var meat = { 
            roles : { 100: 'admins', 50: 'contribs', 10: 'users' },
            signs : { 100: '$', 50: '*', 10: '~' },
            user  : { name: '', online: '', role: '' },
            online: []
        }
    
    app.configure(function(){
      app.set('host', process.env.VCAP_APP_HOST || 'localhost');
      app.set('port', process.env.VCAP_APP_PORT || 3000); //process.env.PORT
      
      // Registers .ejs static file as .html
      app.engine('.html', require('ejs').__express);
      app.set('views', path.join(__dirname, '../views'));
      app.set('view engine', 'html');
      //app.use(express.favicon(path.join(__dirname, '../public/img/favicon.ico'), { maxAge: 86400000 }));
      
      // app.use(express.logger('dev'));
      app.use(express.compress());
      app.use(express.bodyParser());
      app.use(express.methodOverride());
      
      app.use(express.cookieParser('O28N3S5YPV'));
      
      app.use(express.session({ 
            store: new redisstore({ 
                    client: redisdb,
                    secure: true, 
                    maxAge: 24 * 60 * 60 * 1000 }), 
            secret: 'O28N3S5YPV' } ));
      
      // For ejs layouting
      app.use(expressLayouts);

      app.use(function(req, res, next){
           
          if(req.session.user || '') {
            meat.user.name = req.session.user.name;
            meat.user.online = req.session.user.isOnline;
            meat.user.role = req.session.user.role;
            
            redisdb.zadd('online', Date.now(), meat.user.name, next);
          } else
            next();
        });
      
      app.use(function(req, res, next){
          
          if(req.session.user || ''){
              var min = 60 * 1000;
              var ago = Date.now() - min;
              meat.online = [];
              redisdb.zrevrangebyscore('online', '+inf', ago, function(err, users){
                    if (err) return next(err);
                    users.forEach(function(u){ meat.online.push(u); });
                    next();
                });
                
          } else {
            meat.user.online = false;
            next();
            }
        });

      app.use(function (req, res, next) {
       
        res.locals({
            style: '', script: '', 
            username: meat.user.name,
            userstatus: meat.user.online,
            userrole: meat.user.role,
            roles: meat.roles,
            signs: meat.signs,
            online: meat.online
            // e.g. session: req.session
        });
        
        next();
      });
      
      app.use(app.router);
      app.use(express.static(path.join(__dirname, '../public')), { maxAge: 86400000 });

    });
    
    // Dev error handling
    app.configure('development', function(){
      app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
    });

    app.configure('production', function(){
      app.use(express.errorHandler()); 
    });
    
    
}

