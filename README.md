{/*Uploading PDF File*/}
Navigate to http://localhost:3000 in your web browser.
Click on the "Choose File" button and select a PDF file for upload.for the file upload iam using multer
Ensure that only PDF files are accepted through built-in validation.

{/*Visualizing and Selecting Pages*/}
Once the PDF is uploaded, the application will display a visual representation of all pages using the pdf-lib library.
Each page will be associated with a checkbox or a similar UI element.
Users can select/deselect pages they want to extract by toggling the checkboxes.

/*Creating a New PDF*/
After selecting desired pages, click the "Create PDF" button.
The application will generate a new PDF file based on the selected pages.
Click on the download button to save the newly created PDF to your device.

/*Technologies Used*/
Node.js
Express.js
Multer for file upload
pdf-lib for PDF manipulation
Material UI for design ui elements

/*user login and signup */
state management using redux 
only login  user can created pdf otherwise it disable show more button
