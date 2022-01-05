module.exports = { 
    multipleMongooseToObject: function (mongoose){
        return mongoose.map(mongoose => mongoose.toObject());
    },
    mongooseToObject: function(mongoose, options){
        return mongoose ? mongoose.toObject()  : mongoose;  
    }

}
// sensors = sensors.map(sensors => sensors.toObject()); // map sensor to object: loi bao mat cua handlebars
