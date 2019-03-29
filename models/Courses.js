const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String
    },
    instructor:{
        type: String,
        required: true
    }
});

const Course = mongoose.model('course', CourseSchema);
module.exports = Course;