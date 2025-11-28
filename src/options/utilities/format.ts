export const formatData = (data: StoredDataType[]) => {
  const header = ["Text", "Furigana", "Meaning(s)"];
  const rows = data.map((item) => [item.text, item.furigana, ...item.meanings]);
  const escape = (value: string) => `"${String(value).replace(/"/g, '""')}"`;

  const csvLines = [
    header.map(escape).join(","),
    ...rows.map((row) => row.map(escape).join(",")),
  ];

  return csvLines.join("\r\n");
};

export const exportData = (filename: string, data: string) => {
  const blob = new Blob([data], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
