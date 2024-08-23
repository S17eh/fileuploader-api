import XLSX from "xlsx";

const parseExcelFile = (buffer) => {
  const workbook = XLSX.read(buffer, { type: "buffer" });

  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  if (!sheet) {
    throw new Error("No sheet found in the uploaded file.");
  }

  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  const headers = data[0]; // First row as headers
  const rows = data.slice(1); // Remaining rows

  if (rows.length === 0) {
    throw new Error("The sheet is empty or not correctly formatted.");
  }

  const nonEmptyRows = rows.filter((row) =>
    row.some((cell) => cell !== undefined && cell !== null && cell !== "")
  );

  if (nonEmptyRows.length === 0) {
    throw new Error("The sheet does not contain any valid data.");
  }

  return nonEmptyRows.map((row) => {
    let rowData = {};
    headers.forEach((header, index) => {
      rowData[header] = row[index];
    });
    return rowData;
  });
};

export default parseExcelFile;
