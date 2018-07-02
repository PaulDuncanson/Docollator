const express = require("express");
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/authorized');
const DocsController = require('../controllers/docs');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  const acceptableTypes = ['image/jpeg', 
                           'image/png',
                           'application/msword',
                           'application/rtf',
                           'application/x-rtf',
                           'text/richtext',
                           'text/plain',
                           'application/zip',
                           'application/x-zip'];

  if (acceptableTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10  // 10mg file limit
  },
  fileFilter: fileFilter
});

router.get("/", checkAuth, DocsController.docs_get_all);
router.post("/", checkAuth, upload.single('docFile'), DocsController.docs_create_doc);
router.get("/:docId", checkAuth, DocsController.docs_get_doc);
router.patch("/:docId", checkAuth, DocsController.docs_update_doc);
router.delete("/:docId", checkAuth, DocsController.docs_delete_doc);

module.exports = router;
