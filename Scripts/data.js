
import * as XLSX from "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/+esm";
// Determines file type and correct function
export async function parseFile(file) {
	const extension = file.name.split(".").pop().toLowerCase();

	if (extension === "csv") {
		return parseCSV(file);
	}

	if (extension === "xlsx" || extension === "xls") {
		return parseExcel(file);
	}

	throw new Error("Unsupported file type");
}

// Parses a CSV file
function parseCSV(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = e => {
			const values = e.target.result
				.split(/,|\n/)
				.map(v => Number(v.trim()))
				.filter(v => !isNaN(v));

			resolve(values);
		};

		reader.onerror = reject;
		reader.readAsText(file);
	});
}

// Parses an Excel file 
function parseExcel(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = e => {
			const workbook = XLSX.read(e.target.result, { type: "array" });
			const sheet = workbook.Sheets[workbook.SheetNames[0]];

			const data = XLSX.utils.sheet_to_json(sheet, { header: 1 })
            // Flatten rows into a single array
				.flat()
				.map(v => Number(v))
                // Ignore non numbers
				.filter(v => !isNaN(v));

			resolve(data);
		};

		reader.onerror = reject;
		reader.readAsArrayBuffer(file);
	});
}
