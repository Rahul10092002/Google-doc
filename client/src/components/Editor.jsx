import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction

  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ["clean"], // remove formatting button
];

const Editor = () => {
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();
  const { id } = useParams();
  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;
    wrapper.innerHTML = ""; // Fix the typo here
    const editor = document.createElement("div");
    wrapper.append(editor);
    const quillserver = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: toolbarOptions },
    });
    setQuill(quillserver);
  }, []);

  useEffect(() => {
    const socketServer = io("http://localhost:9000");
    
    setSocket(socketServer);
    return () => {
      socketServer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket === null || quill === null) return;
    const handleChange = (delta, allData, source) => {
      if (source !== "user") return;
      socket && socket.emit("send-changes", delta);
    };
    quill && quill.on("text-change", handleChange);
    return () => {
      quill && quill.off("text-change", handleChange);
    };
  }, [quill, socket]);

  useEffect(() => {
    if (socket === null || quill === null) return;
    const handleChange = (delta) => {
      quill.updateContents(delta);
    };

    socket && socket.on("recieve-changes", handleChange);

    return () => {
      socket && socket.off("recieve-changes", handleChange);
    };
  }, [quill, socket]);

  useEffect(() => {
    if (quill === null || socket === null) return;

    socket &&
      socket.once("load-document", (document) => {
        // console.log("Document loaded:", document);
        quill.setContents(document);
          quill.enable();
      });
    socket && socket.emit("get-document", id);
  }, [quill, socket, id]);

  useEffect(() => {
    if (socket == null || quill === null) return;
    const interval = setInterval(() => {
     socket.emit("save-document", quill.getContents());
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [socket, quill]);

  return (
    <>
      <div className="container" ref={wrapperRef} />
    </>
  );
};

export default Editor;
