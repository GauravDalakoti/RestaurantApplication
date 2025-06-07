// import multer from 'multer';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Set storage engine
// const storage = multer.diskStorage({
//   destination: path.join(__dirname, '../uploads/'),
//   filename: function(req, file, cb) {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   }
// });

// // Check file type
// function checkFileType(file, cb) {
//   // Allowed extensions
//   const filetypes = /jpeg|jpg|png|gif/;
//   // Check extension
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   // Check mime
//   const mimetype = filetypes.test(file.mimetype);

//   if (mimetype && extname) {
//     return cb(null, true);
//   } else {
//     cb(new Error('Only image files are allowed!'));
//   }
// }

// // Initialize upload
// const upload = multer({
//   storage,
//   limits: { fileSize: 1000000 }, // 1MB
//   fileFilter: function(req, file, cb) {
//     checkFileType(file, cb);
//   }
// });

// export default upload;

import multer from "multer"

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, './public/temp')
    },
    filename: function (req, file, cb) {

        cb(null, file.originalname)
    }
})

export const upload = multer({ storage: storage })