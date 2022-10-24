import "./AddSources.css";
import Container from "./Container";
import { useDropzone } from "react-dropzone";

import { FileTable } from "./FileTable";

import Button from "./Button";
import { useFileStore } from "../lib/useFileStore";


function FileUploader() {
  const { addFiles, hasFiles } = useFileStore();

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
      {!hasFiles() && (
        <div className="FilesDropzone" {...getRootProps()}>
          Drop ".fc" files here
        </div>
      )}
      {hasFiles() && (
        <div {...getRootProps()}>
          <Button text="Upload source" />
        </div>
      )}

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
      />
    </>
  );
}

function AddSources() {
  const { hasFiles } = useFileStore();
  return (
    <Container>
      <h3 style={{ textAlign: "center" }}>Add sources</h3>
      <FileUploader />
      {hasFiles() && <FileTable />}
    </Container>
  );
}

export default AddSources;
