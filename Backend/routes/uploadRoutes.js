const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, upload.single('file'), (req, res) => {
    try{
        if(!req.file) {
            return res.status(400).json({ msg: "No file uploaded" });
        }
        res.status(200).json({ msg: "file uploaded successfully", url:req.file.path });
    }
    catch(err){
        res.status(500).json({ msg: "File upload failed", error: err.message });
    }
});
module.exports = router;