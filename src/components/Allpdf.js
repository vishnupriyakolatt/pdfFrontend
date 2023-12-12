import React, { useEffect, useState } from "react";
import axios from "axios";

import Cards from "./Cards";
import PdfComp from "./PdfComp";
import { useNavigate } from "react-router-dom";

function Allpdf() {
  const navigate=useNavigate()
  const [allImage, setAllImage] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);

  const showPdf = (pdf) => {
    // window.open(`http://localhost:5000/files/${pdf}`, "_blank", "noreferrer");
    // setPdfFile(`http://localhost:8000/files/${pdf}`);
    navigate(`/blogslist/${pdf}`)
  };
  const getPdf = async () => {
    try {
      const result = await axios.get("http://localhost:8000/api/pdf/get-files");
      console.log(result.data.data);
      return result;
      // setAllImage(result.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getPdf()
      .then((data) => {
        console.log(data);
        setAllImage(data.data.data);
      })
      .catch((err) => console.log(err));
  }, []);
  console.log(allImage);

  return (
    <>
      {allImage == null
        ? ""
        : allImage.map((data) => {
            return (
              <Cards
                id={data._id}
                key={data._id}
                title={data.title}
                onSubmit={() => showPdf(data.pdf)}
                userName={data.pdf}
              />
            );
          })}
      {/* <PdfComp pdfFile={pdfFile} /> */}
    </>
  );
}

export default Allpdf;
