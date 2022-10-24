import "./AddSources.css";
import Container from "./Container";
import { useDropzone } from "react-dropzone";

import { FileTable } from "./FileTable";

import create from "zustand";
export const useFileStore = create<{
  files: any[];
  addFiles: (files: any[]) => void;
}>((set) => ({
  files: [],
  addFiles: (files) => set((state) => ({ files: [...state.files, ...files] })),
}));

function FileUploader() {
  const { addFiles } = useFileStore();

  const onDrop = (acceptedFiles: any) => {
    addFiles(acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/plain": [".fc", ".func"] },
    // noClick: true,
  });

  return (
    <>
      <div className="FilesDropzone" {...getRootProps()}>
        Drop ".fc" files here
      </div>

      <input
        {...getInputProps()}
        // onChange={onUploadFiles}
        onClick={(e) => {
          // @ts-ignore
          e.target.value = "";
        }}
        style={{ display: "none" }}
        id="fileUpload"
        type="file"
        multiple
        accept=".fc,.func"
        // ref={inputRef}
        // @ts-ignore
        webkitdirectory={true}
      />
    </>
  );
}

function AddSources() {
  const { files } = useFileStore();
  return (
    <Container>
      <h3 style={{ textAlign: "center" }}>Add sources</h3>
      <FileUploader />
      <FileTable />
    </Container>
  );
}

export default AddSources;
