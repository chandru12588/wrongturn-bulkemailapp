import * as XLSX from "xlsx";

export const readExcelEmails = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);

      const emails = json.map((row) => row.email || row.Email);
      resolve(emails);
    };

    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};
