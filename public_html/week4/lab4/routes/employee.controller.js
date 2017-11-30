var Employee = require('./employee.model');
var debug = require('debug')('lab4:employee');

module.exports.home = function(req, res){

req.checkBody('firstName', 'First name is required').notEmpty();
req.checkBody('lastName', 'Last name is required').notEmpty();
req.checkBody('department', 'Department is required').notEmpty();
req.checkBody('startDate', 'Start date is required').notEmpty();
req.checkBody('jobTitle', 'Job title is required').notEmpty();
req.checkBody('salary', 'Salary is required').notEmpty();
		
var errors = "";
    
    if (req.method === 'POST' && !errors) {
        
       var msg = '';
        
        Employee.create({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          department: req.body.department,
          startDate: req.body.startDate,
          jobTitle: req.body.jobTitle,
          salary: req.body.salary
        })
        .then(function(){
            msg = 'New employee was added.';
            errors = '';
            return;
        })
        .catch(function(err){            
            msg = 'Entered invalid information.';
            return err.message;
        }).then(function(err){
            res.render('index', { 
                title: 'Enter Information',
                message : msg,
                error: req.validationErrors()
             });
        });   
              
    } else {
        res.render('index', { 
            title: 'Enter Information',
            message : '',
            error: ''
        }); 
    }
     
};

module.exports.view = function(req, res){
    
       Employee
       .find()
       .exec()
       .then(function(results){
            res.render('view', { 
                title: 'All Employees' + ' (' + results.length + ')',
                results : results
            });
       }); 
};

module.exports.delete = function(req, res){

     var id = req.params.id,
         removed = '';
      
        Employee.remove({ _id: id })
        .then(function(){            
            removed = `Employee (ID:"${id}") has been removed.`;
            return;
        })
        .catch(function (err) {            
            removed = `Employee (ID:"${id}") has not been removed.`;
            return err; 
        })
        .then( (err) => {
          res.render('delete', { 
                removed : removed
            });    
        });                           
};

module.exports.update = function(req, res){
    
    var id = req.params.id;
    var msg = '';
    
    if (req.method === 'POST') {
         
        id = req.body._id;

        Employee
            .findById(id)
            .exec() 
            .then(function(employeeData) {
                // figure out why the data is not saving. 
                debug(req.body);
                employeeData.firstName = req.body.firstName;
                employeeData.lastName = req.body.lastName;
                employeeData.department = req.body.department;
                employeeData.startDate = req.body.startDate;
                employeeData.jobTitle = req.body.jobTitle;
                employeeData.salary = req.body.salary;

                return employeeData.save();
                                
            })
            .then(function(){
                msg = 'Employee has been updated.';
            })
            .catch(function(err){
                msg = 'Employee has NOT been updated.';
                debug(err);
            });
        
    }
        
    Employee
    .findOne({ '_id': id })
    .exec()
    .then(function(results){    
        res.render('update', { 
            title: 'Update Employee',
            message: msg,
            results : results
        });
    })
    .catch(function(){
        res.render('notfound', { 
            message: 'Employee ID not found.'
        });
    });
};