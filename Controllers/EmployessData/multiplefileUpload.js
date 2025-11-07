module.exports.UploadDocuments = async function (req, res) {
  try {
    if (!req.files || req.files.length === 0) {
      return res.json({ response: 0, message: "Please upload documents" });
    }

    const filePaths = req.files.map(file => "/uploads/" + file.filename);

    return res.json({
      response: 3,
      message: "Documents uploaded successfully",
      files: filePaths
    });
  } catch (err) {
    console.error("Error in UploadDocuments:", err.message);
    return res.status(500).json({ response: 0, message: "Internal Server Error" });
  }
};


// Multiple files upload API(this one using the Router class)
router.post("/uploadDocuments", upload.array("documents", 5), profileController.UploadDocuments);

