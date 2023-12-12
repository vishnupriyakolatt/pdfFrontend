import { useState, useEffect } from "react";
import { Document, Page } from "react-pdf";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import { useParams } from "react-router-dom";
import axios from "axios";

function PdfComp(props) {
  const id=useParams()
  const [pdfFile, setPdfFile] = useState(null);
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
        const response = await axios.get(`http://localhost:8000/files/${id.id}`, {
          responseType: 'arraybuffer', 
        });
  
        console.log("Response from server:", response);
  
        // Check if the response contains valid PDF data
        if (response && response.data instanceof ArrayBuffer) {
          // setPdfFile(response.data);
          const sourcePdfBytes = response.data;
          await extractAndCreateNewPdf(sourcePdfBytes, selectedPages);
        } else {
   
          console.error("Invalid PDF data received from the server");
        }
      } catch (error) {
        console.error('Error fetching PDF file:', error);
        // Handle error, e.g., show an error message to the user
      }
    
  //   try {
  //     // Check if pdfFile is an ArrayBuffer
  //     if (pdfFile instanceof ArrayBuffer) {
  //       console.log(pdfFile)
  //       await extractAndCreateNewPdf(pdfFile, selectedPages);
  //     } else {
  //       const response = await fetch(pdfFile);
  
  //       // Log the response to inspect
  //       console.log("Fetch Response:", response);
  
  //       if (!response.ok) {
  //         throw new Error(`Failed to fetch PDF file. Status: ${response.status}`);
  //       }
  
  //       const sourcePdfBytes = await response.arrayBuffer();
  
  //       // Log the sourcePdfBytes to inspect
  //       console.log("PDF Bytes:", sourcePdfBytes);
  
  //       if (!(sourcePdfBytes instanceof ArrayBuffer) || sourcePdfBytes.byteLength === 0) {
  //         throw new Error('Invalid PDF data received from the server');
  //       }
  
  //       await extractAndCreateNewPdf(sourcePdfBytes, selectedPages);
  //     }
  //   } catch (error) {
  //     console.error("Error creating new PDF", error);
  //   }
  // };
    }
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/files/${id.id}`, {
          responseType: 'arraybuffer', 
        });
  
        console.log("Response from server:", response);
  
        // Check if the response contains valid PDF data
        if (response && response.data instanceof ArrayBuffer) {
          setPdfFile(response.data);
        } else {
          console.error("Invalid PDF data received from the server");
        }
      } catch (error) {
        console.error('Error fetching PDF file:', error);
        // Handle error, e.g., show an error message to the user
      }
    };
  
    fetchData();
  }, [id.id]); 
   
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
      <Document file={pdfFile} onLoadSuccess={handleDocumentLoadSuccess}>
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
