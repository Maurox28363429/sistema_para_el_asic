import { XLSX } from "xlsx";
import { saveAs } from "file-saver";
// Utility function to convert a binary string to an array buffer
function s2ab(s) {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
  return buf;
}
function exportExcel(data, nombre) {
  // Create a new workbook and add a worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  // Generate a binary string from the workbook
  const wbBinaryString = XLSX.write(wb, {
    bookType: "xlsx",
    type: "binary",
  });

  // Convert the binary string to a Blob
  const wbBlob = new Blob([s2ab(wbBinaryString)], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  // Save the file to the user's computer
  saveAs(wbBlob, nombre);
}
export default exportExcel;
