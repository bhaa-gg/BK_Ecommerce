## hooks

document and query middleware

Document middleware is supported for the following document functions. In Mongoose, a document is an instance of a Model class. In document middleware functions, this refers to the document. To access the model, use this.constructor.

validate
save
remove
updateOne
deleteOne
init (note: init hooks are synchronous)

---

Query middleware is supported for the following Query functions. Query middleware executes when you call exec() or then() on a Query object, or await on a Query object. In query middleware functions, this refers to the query.

count
countDocuments
deleteMany
deleteOne
estimatedDocumentCount
find
findOne
findOneAndDelete
findOneAndReplace
findOneAndUpdate
remove
replaceOne
updateOne
updateMany
validate