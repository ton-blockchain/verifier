import { useFileStore } from "../lib/useFileStore";
import { useDropzone } from "react-dropzone";
import Button from "./Button";
import React from "react";

export function FileUploaderArea() {
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
