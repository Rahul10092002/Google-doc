import mongoose from "mongoose";

export const connection = async () => {
  const Url = `mongodb+srv://rahulpatidar1009:rahul1009@google-doc.4sfgxku.mongodb.net/?retryWrites=true&w=majority`;

  try {
    await mongoose.connect(Url);
    console.log("mongodb connected");
  } catch (error) {
    console.log(error);
  }
};
