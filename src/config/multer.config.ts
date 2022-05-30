import multer from "multer";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});
export const upload = multer({
  //multer settings
  storage: storage,
}).single("file");
upload;

const imageStorage = multer.memoryStorage();
export const imageUplaod = multer({ storage: imageStorage });
