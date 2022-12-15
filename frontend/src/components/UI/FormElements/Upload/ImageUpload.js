import React, { useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";

const ImageUpload = (props) => {
  const [file, setFile] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const [image, setImage] = useState("");

  const filePickerRef = useRef();

  useEffect(() => {
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setImage(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  }, [file]);

  const pickedHandler = (event) => {
    let pickedFile;
    let fileIsValid = false;

    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];

      setFile(pickedFile);
      setIsValid(true);

      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }

    props.onInput(pickedFile, fileIsValid, props.name);
  };

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  return (
    <div className="d-flex justify-content-center flex-column img-container">
      <input
        type="file"
        name={props.name}
        onChange={pickedHandler}
        ref={filePickerRef}
        accept=".jpg,.png,.jpeg"
        style={{ display: "none" }}
      />
      {image && <img src={image} alt="Product" />}
      <Button
        variant="outline-dark"
        onClick={pickImageHandler}
        className="align-self-center mt-2">
        Upload
      </Button>
      <p className="text-center">{!isValid && props.errorMessage}</p>
    </div>
  );
};

export default ImageUpload;
