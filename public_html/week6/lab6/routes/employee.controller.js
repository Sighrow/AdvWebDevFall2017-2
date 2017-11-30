var Employee = require('./employee.model');
var debug = require('debug')('lab6:employee');

function sendJSONresponse(res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.employeesReadAll = function(req, res) {
        
    debug('Getting all employees');
    debug(req.where);

    
    var where = {};
    var options = {};
    options.sort = null;
       
    if (req.query) {
        debug(req.query);
          
        /* Prevent Parameter Pollution
         * https://www.npmjs.com/package/hpp         
         * ?_sort=author&_sort=author = && typeof(req.query._sort) === 'string' 
         */
        if (req.query._sort && typeof(req.query._sort) === 'string') {
            var prefix = 1;
            if (req.query._sort.match(/-/)) prefix = -1;
            var field = req.query._sort.replace(/-|\s/g, '');
            options.sort = {};
            options.sort[field] = prefix;
        }
        
    }
    
    debug('options', options);
    
    Employee
     .find(req.where, null, options)
     .exec()
     .then(function(results){
        sendJSONresponse(res, 200, results);
     })
     .catch(function(err){
        sendJSONresponse(res, 404, err);         
     });
         
};

module.exports.employeesReadOne = function(req, res) {
    
    if (req.params && req.params.employeeid) {
        debug('Getting single employee with id =', req.params.employeeid );
        
        Employee
        .findById(req.params.employeeid)
        .exec()
        .then(function(results){
            sendJSONresponse(res, 200, results);
        }).catch(function(err){
            sendJSONresponse(res, 404, {
                "message": "employeeid not found"
            });
        });

    } else {
        sendJSONresponse(res, 404, {
            "message": "employeeid not found"
        });
    }
};

/*   POST a new employee
 *   /api/v1/employees 
 */
module.exports.employeesCreate = function(req, res) {
    
    debug('Creating a employee with data ', req.body);
    
    Employee.create({
          author: req.body.author,
          rating: req.body.rating,
          employeeText: req.body.employeeText
    })
    .then(function(dataSaved){
        debug(dataSaved);
        sendJSONresponse(res, 201, dataSaved);
    })
    .catch(function(err){ 
        debug(err);
        sendJSONresponse(res, 400, err);
    });
     
};

module.exports.employeesUpdateOne = function(req, res) {
    
  if ( !req.params.employeeid ) {
    sendJSONresponse(res, 404, {
        "message": "Not found, employeeid is required"
    });
    return;
  }
  
  Employee
    .findById(req.params.employeeid)
    .exec()
    .then(function(employeeData) {        
        employeeData.author = req.body.author;
        employeeData.rating = req.body.rating;
        employeeData.employeeText = req.body.employeeText;

        return employeeData.save();
    })
    .then(function(data){
        sendJSONresponse(res, 200, data);
    })
    .catch(function(err){
        sendJSONresponse(res, 400, err);
    });
        
};

module.exports.employeesDeleteOne = function(req, res) {
  if ( !req.params.employeeid ) {
    sendJSONresponse(res, 404, {
        "message": "Not found, employeeid is required"
    });
    return;
  }
  
  Employee
    .findByIdAndRemove(req.params.employeeid)
    .exec()
    .then(function(data){
        debug("Employee id " + req.params.employeeid + " deleted");
        debug(data);
        sendJSONresponse(res, 204, null);
    })
    .catch(function(err){
        sendJSONresponse(res, 404, err);
    });
    
};