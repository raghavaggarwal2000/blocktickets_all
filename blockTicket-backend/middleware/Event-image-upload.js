const multer = require("multer");
const path = require("path");
const os = require("os")

const imageStorage = multer.diskStorage({
  // Destination to store image
  destination: (req, file, cb) => {
    cb(null, path.join(os.tmpdir()));
  },
  filename: (req, file, cb) => {
    console.log("image", req, file);
    const fileName = req.user.userId + file.fieldname + path.extname(file.originalname);
    console.log('in img1', file);
    if(file.fieldname == 'logo'){
        req.user.organizerImage = fileName
        console.log('in img2');
    }
    else if(file.fieldname == 'pan') {
      req.user.pan = fileName
    }
    else if(file.fieldname == 'cheque') {
      req.user.cheque = fileName
    }
    else{
        req.user.logoImage = fileName
        console.log('in img3');
        console.log(req.user.logoImage);
    }
    const dateStamp = Date.now();
    console.log('in img4');
    console.log("file")
    cb(
      null,
      fileName
    );
    console.log("fileName")
  },
});

const imageUpload = multer({ 
  storage: imageStorage,
  limits: {
    fileSize: 30000000, // 30000000 Bytes = 30 MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg|gif)$/)) {
      // upload only png and jpg format
      return cb(new Error("Please upload the valid image file"));
    }
    cb(null, true);
  },
});
module.exports = imageUpload;
