import React from 'react';
import { Box, Button, Text } from "@radix-ui/themes";
import { TrashIcon } from "@radix-ui/react-icons";

const NodeImage = ({ image, handleRemoveImage, handleUploadClick, fileInputRef, handleImageChange }) => (
  <>
    {image ? (
      <Box style={{ position: "relative", width: "100%", height: "220px" }}>
        <img
          src={image}
          alt="Node"
          style={{
            objectFit: "cover",
            width: "100%",
            height: "100%",
            borderRadius: "var(--radius-2)",
          }}
        />
        <Button
          variant="soft"
          color="red"
          style={{ position: "absolute", top: 10, right: 10 }}
          onClick={handleRemoveImage}
        >
          <TrashIcon />
        </Button>
      </Box>
    ) : (
      <Box
        onClick={handleUploadClick}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "220px",
          borderRadius: "var(--radius-2)",
          border: "2px dashed var(--gray-a7)",
          cursor: "pointer",
        }}
      >
        <Text>Upload Image</Text>
      </Box>
    )}
    <input
      type="file"
      accept="image/*"
      ref={fileInputRef}
      onChange={handleImageChange}
      style={{ display: "none" }}
    />
  </>
);

export default NodeImage;
