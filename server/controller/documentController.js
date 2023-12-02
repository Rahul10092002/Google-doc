import Document from "../database/documentSchema.js";


export const getDocument = async (id) => {
  if (id === null) return;

  const doc = await Document.findById(id);

  if (doc) {
    return doc;
  }

  // If the document doesn't exist, you should provide the ID to the `create` method.
  return await Document.create({ _id: id, data: "" });
};

export const updateDocument = async (id, data) => {
    return await Document.findByIdAndUpdate(id, { data });
    
};