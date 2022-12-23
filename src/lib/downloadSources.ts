import JSZip from "jszip";
import FileSaver from "file-saver";

export function downloadSources(
  files: {
    name: string;
    content: string;
  }[],
) {
  const zip = new JSZip();
  files.map((f) => zip.file(f.name, f.content));
  zip.generateAsync({ type: "blob" }).then(function (content) {
    FileSaver.saveAs(content, "sources.zip");
  });
}
