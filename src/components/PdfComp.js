import { useState, useEffect } from "react";
import { Document, Page } from "react-pdf";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";

function PdfComp(props) {
  const [numPages, setNumPages] = useState();
  const [selectedPages, setSelectedPages] = useState([]);

  const extractAndCreateNewPdf = async (sourcePdfBytes, selectedPages) => {
    try {
      const sourcePdfDoc = await PDFDocument.load(sourcePdfBytes);
      const newPdfDoc = await PDFDocument.create();
      for (const page of selectedPages) {
        console.log("Copying Page:", page);
        const [copiedPage] = await newPdfDoc.copyPages(sourcePdfDoc, [
          page - 1,
        ]);
        newPdfDoc.addPage(copiedPage);
      }

      const newPdfBytes = await newPdfDoc.save();

      const blob = new Blob([newPdfBytes], { type: "application/pdf" });

      saveAs(blob, "newPdf.pdf");
    } catch (error) {
      console.error("Error creating new PDF", error);
    }
  };

  const handleCheckboxChange = (page) => {
    setSelectedPages((prevSelectedPages) => {
      if (prevSelectedPages.includes(page)) {
        return prevSelectedPages.filter(
          (selectedPage) => selectedPage !== page
        );
      } else {
        return [...prevSelectedPages, page];
      }
    });
  };

  const handleDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleCreateNewPdf = async () => {
    console.log("Selected Pages:", selectedPages);
    try {
      const sourcePdfBytes = await fetch(props.pdfFile).then((res) =>
        res.arrayBuffer()
      );
      await extractAndCreateNewPdf(sourcePdfBytes, selectedPages);
    } catch (error) {
      console.error("Error creating new PDF", error);
    }
  };

  return (
    <div
      className="pdf-div"
      style={{
        backgroundColor: "#ffffff",
        padding: "20px",
        borderRadius: "10px",
        marginTop: 10,
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Document file={props.pdfFile} onLoadSuccess={handleDocumentLoadSuccess}>
        {Array.from({ length: numPages }, (_, index) => index + 1).map(
          (page) => (
            <div key={page} style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedPages.includes(page)}
                  onChange={() => handleCheckboxChange(page)}
                  style={{ marginRight: "10px" }}
                />
                <span style={{ fontWeight: "bold", marginLeft: "5px" }}>
                  Page {page}
                </span>
              </label>
              <Page
                key={`page_${page}`}
                pageNumber={page}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                style={{ border: "1px solid #ddd", borderRadius: "5px" }}
              />
            </div>
          )
        )}
        <button
          onClick={handleCreateNewPdf}
          style={{
            backgroundColor: "#000",
            color: "#ffffff",
            padding: "10px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Create New PDF
        </button>
      </Document>
    </div>
  );
}
export default PdfComp;
