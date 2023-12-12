import { useEffect, useState } from "react";
import axios from "axios";
import { pdfjs } from "react-pdf";
import PdfComp from "../components/PdfComp";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { Navigate, useNavigate } from "react-router-dom";
import {
  Box,
  InputLabel,
  TextField,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  CardMedia,
} from "@mui/material";

const labelStyles = { mb: 1, mt: 2, fontSize: "20px", fontWeight: "bold" };
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

function AddPdf() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [file, setFile] = useState("");
  const [allImage, setAllImage] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");

  useEffect(() => {
    getPdf();
  }, []);
  const getPdf = async () => {
    try {
      const result = await axios.get("http://localhost:8000/api/pdf/get-files");
      console.log(result.data.data);
      setAllImage(result.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const submitImage = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);
    console.log(title, file);

    try {
      const result = await axios.post(
        "http://localhost:8000/api/pdf/upload-files",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log(result);

      if (result.data.status === "ok") {
        setUploadMessage("Uploaded Successfully!!!");
        navigate("/blogslist");
      } else {
        setUploadMessage("Upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadMessage("An error occurred. Please try again.");
    }
  };

  const showPdf = (pdf) => {
    // window.open(`http://localhost:8000/files/${pdf}`, "_blank", "noreferrer");
    setPdfFile(`http://localhost:8000/files/${pdf}`);
  };
  return (
    <div className="App">
      <form onSubmit={submitImage}>
        <Box
          border={3}
          borderColor="linear-gradient(135deg, rgba(43,44,212,1) 0%, rgba(140,0,161,1) 38%, rgba(69,245,252,1) 99%)"
          borderRadius={10}
          boxShadow="10px 10x 20px #ccc"
          padding={3}
          margin={"auto"}
          marginTop={3}
          display="flex"
          flexDirection={"column"}
          width={"80%"}
        >
          <Typography
            fontWeight={"bold"}
            padding={3}
            color={"black"}
            variant="h5"
            textAlign="center"
          >
            Upload your PDF file
          </Typography>
          <InputLabel sx={labelStyles}>Title</InputLabel>
          <TextField
            name="title"
            onChange={(e) => setTitle(e.target.value)}
            margin="auto"
            variant="outlined"
          />
          <InputLabel sx={labelStyles}>upload pdf</InputLabel>
          <TextField
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            margin="auto"
            variant="outlined"
          />
          <Button
            sx={{
              mt: 2,
              borderRdius: 4,
              borderRadius: 0,
              backgroundColor: "#000",
              color: "#ffffff",
            }}
            variant="contained"
            type="submit"
          >
            Submit
          </Button>
        </Box>

        {uploadMessage && (
          <Alert
            severity={uploadMessage.includes("failed") ? "error" : "success"}
            sx={{ marginTop: 2 }}
            onClose={() => {
              if (!uploadMessage.includes("failed")) {
                navigate("/blogslist");
              }
            }}
          >
            <AlertTitle>
              {uploadMessage.includes("failed") ? "Error" : "Success"}
            </AlertTitle>
            {uploadMessage}
          </Alert>
        )}
      </form>
    
 
      
    </div>
  );
}
export default AddPdf;
