import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Papa from "papaparse";

const Index = () => {
  const [csvData, setCsvData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [newRow, setNewRow] = useState({});

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      complete: (results) => {
        setHeaders(results.data[0]);
        setCsvData(results.data.slice(1));
      },
      header: true,
    });
  };

  const handleEdit = (index) => {
    setEditingRow(index);
  };

  const handleSave = (index) => {
    setEditingRow(null);
  };

  const handleDelete = (index) => {
    const newData = [...csvData];
    newData.splice(index, 1);
    setCsvData(newData);
  };

  const handleInputChange = (index, header, value) => {
    const newData = [...csvData];
    newData[index][header] = value;
    setCsvData(newData);
  };

  const handleNewRowChange = (header, value) => {
    setNewRow({ ...newRow, [header]: value });
  };

  const handleAddRow = () => {
    setCsvData([...csvData, newRow]);
    setNewRow({});
  };

  const handleDownload = () => {
    const csv = Papa.unparse([headers, ...csvData]);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "exported_data.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">CSV Management Tool</h1>
      
      <div>
        <Input type="file" accept=".csv" onChange={handleFileUpload} />
      </div>

      {csvData.length > 0 && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((header) => (
                  <TableHead key={header}>{header}</TableHead>
                ))}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {csvData.map((row, index) => (
                <TableRow key={index}>
                  {headers.map((header) => (
                    <TableCell key={header}>
                      {editingRow === index ? (
                        <Input
                          value={row[header]}
                          onChange={(e) => handleInputChange(index, header, e.target.value)}
                        />
                      ) : (
                        row[header]
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    {editingRow === index ? (
                      <Button onClick={() => handleSave(index)}>Save</Button>
                    ) : (
                      <Button onClick={() => handleEdit(index)}>Edit</Button>
                    )}
                    <Button variant="destructive" onClick={() => handleDelete(index)} className="ml-2">
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Add New Row</h2>
            {headers.map((header) => (
              <Input
                key={header}
                placeholder={header}
                value={newRow[header] || ""}
                onChange={(e) => handleNewRowChange(header, e.target.value)}
              />
            ))}
            <Button onClick={handleAddRow}>Add Row</Button>
          </div>

          <Button onClick={handleDownload}>Download CSV</Button>
        </>
      )}
    </div>
  );
};

export default Index;