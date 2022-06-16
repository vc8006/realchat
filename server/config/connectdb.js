const mongoose = require('mongoose');

const connectdb = mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log('DB connection successful');
}).catch((err)=>{
    console.log(err.message)
});

module.exports=connectdb;