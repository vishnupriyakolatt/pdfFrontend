import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { Button, CardActions } from "@mui/material";


const bull = (
  <Box
    component="span"
    sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
  >
    •
  </Box>
);

export default function Cards({
  title,
  description,
  imageURL,
  userName,
  onSubmit,
  isUser,
  id,
}) {
  return (
    <Card sx={{ maxWidth: 250, margin: "auto", mb: 0, mt: 6 }}>
      <img
        src="https://t4.ftcdn.net/jpg/04/65/41/29/360_F_465412924_Ir2XnMp0TYJYtpl1IdNSPYt0UNDVMJv3.jpg" // Replace with the actual URL of your PDF icon
        alt="PDF Icon"
        style={{
          width: "40%",
          height: "auto",
          margin: "auto",
          display: "block",
        }}
      />
      <Typography
        sx={{
          fontSize: "15px",
          fontWeight: "bold",
          color: "#000",
          textAlign: "center",
          paddingBottom: 4,
        }}
      >
        Title: {userName}
      </Typography>
      <CardActions>
        {localStorage.getItem('userId')&&(
          <Button size="small" onClick={onSubmit}>SHOW PDF</Button>
        )}
        
      </CardActions>
    </Card>
  );
}
