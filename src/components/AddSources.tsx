import "./AddSources.css";
import { useDropzone } from "react-dropzone";

import { FileTable } from "./FileTable";

import Button from "./Button";
import { useFileStore } from "../lib/useFileStore";
import CompilerSettings from "./CompilerSettings";
import Spacer from "./Spacer";
import { useSubmitSources } from "../lib/useSubmitSources";
import { CompileOutput } from "./CompileOutput";

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
  const { mutate, data, error, isLoading } = useSubmitSources();

  return (
    <>
      <h3>Add sources</h3>
      <FileUploader />
      <Spacer space={20} />
      {hasFiles() && <FileTable />}
      {hasFiles() && <CompilerSettings />}
      <Spacer space={20} />
      <Button
        disabled={!hasFiles() || !!data?.result?.msgCell}
        onClick={() => {
          mutate(null);
        }}
        text={isLoading ? "Submitting..." : `Submit`}
      />
      <Spacer space={15} />
      {(data || error) && <CompileOutput />}
    </>
  );
}

export default AddSources;
