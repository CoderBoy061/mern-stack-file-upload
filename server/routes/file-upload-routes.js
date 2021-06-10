const express = require('express');
const {upload} = require('../helpers/helper.js');
const {multipleFileUpload,getMultipleFiles} = require('../controllers/fileupload.js');

const router = express.Router();
router.get('/',(req,res)=>{
    res.send('hello from server');
})

router.post('/multipleFile',upload.array('files'),multipleFileUpload);
router.get('/getMultipleFile',getMultipleFiles)

module.exports = {router}