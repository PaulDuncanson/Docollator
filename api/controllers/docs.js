const mongoose = require("mongoose");
const docModel = require("../models/doc");

exports.docs_get_all = (req, res, next) => {
  docModel.find()
    .select("_id name email docFile")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        docs: docs.map(thisDoc => {
          return {
            _id: thisDoc._id,
            name: thisDoc.name,
            email: thisDoc.email,
            docFile: thisDoc.docFile,
            request: {
              type: "GET",
              url: "http://localhost:3000/docs/" + thisDoc._id
            }
          };
        })
      };
      if (docs.length >= 0) {
        res.status(200).json(response);
      } else {
        res.status(404).json({
        message: 'No entries found'
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.docs_create_doc = (req, res, next) => {
  const newDoc = new Document({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    email: req.body.email,
    docFile: req.file.path
  });
  newDoc
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created document successfully",
        createdDoc: {
          name: result.name,
          email: result.email,
          docFile: result.docFile,
          _id: result._id,
          request: {
            type: "GET",
            url: "http://localhost:3000/docs/" + result._id
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.docs_get_doc = (req, res, next) => {
  const id = req.params.docId;
  docModel.findById(id)
    .select("_id name email docFile")
    .exec()
    .then(thisDoc => {
      console.log("From database: ", thisDoc);
      if (thisDoc) {
        res.status(200).json({
          doc: thisDoc,
          request: {
            type: "GET",
            url: "http://localhost:3000/docs"
          }
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.docs_update_doc = (req, res, next) => {
  const id = req.params.docId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  docModel.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Document updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/docs/" + id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.docs_delete_doc = (req, res, next) => {
  const id = req.params.docId;
  docModel.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Document deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/docs",
          body: { name: "String", email: "String", docFile: "String" }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};
