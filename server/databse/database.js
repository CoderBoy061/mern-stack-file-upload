const mongoose = require('mongoose');
const uri = 'mongodb+srv://debabrata:W41bg0Kxk7ASBXDc@cluster0.agmf9.mongodb.net/file-upload?retryWrites=true&w=majority';
 
module.exports = ()=>{
   mongoose.connect(uri,{
       useNewUrlParser:true,
       useUnifiedTopology:true,
       useCreateIndex:true,
       useFindAndModify:false
   }).then(()=>{
       console.log("Database connection successfully");
   }).catch((error)=>{
       console.log(error.message);
   })
}
