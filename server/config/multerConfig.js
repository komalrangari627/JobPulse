import multer from "multer";
import fs from "fs";
import path from "path";

let storage = multer.diskStorage({
  //  Create upload destination folder dynamically
  destination: (req, file, cb) => {
    const uploadPath = path.join("uploads", req.params.file_type);

    // if folder doesn't exist — create it recursively
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
      console.log(` Created folder: ${uploadPath}`);
    }

    cb(null, uploadPath);
  },

  //  Set unique filename
  filename: (req, file, cb) => {
    const originalName = file.originalname;
    const uniqueName = `${Date.now()}-${req.params.file_type}-${req.user._id}-${originalName}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

export { upload };
