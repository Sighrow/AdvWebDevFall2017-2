var mongoose = require('mongoose');

var employeeSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required.']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required.']
    },
    department: {
        type: String
    },
    jobTitle: {
        type: String,
        required: [true, 'Job title is required.']
    },
    startDate: {
        type: Date,
        "default": Date.now,
        required: [true, 'Start date is required.']
    },
    salary: {
        type: Number,
        required: [true, 'Salary is required.']
    }
});

var Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;