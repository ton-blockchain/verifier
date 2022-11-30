function download(content: string, fileName: string, contentType: string) {
  const a = document.createElement("a");
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}

async function downloadJson(link: string) {
  try {
    let response = await fetch(link);
    let responseJson = await response.json();
    download(JSON.stringify(responseJson), "sources.json", "text/json");
  } catch (error) {
    console.error(error);
  }
}

export { downloadJson };
