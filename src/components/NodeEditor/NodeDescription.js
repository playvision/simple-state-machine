import React, { useRef, useEffect } from 'react';
import { Box, Heading, Text, TextArea, ScrollArea } from "@radix-ui/themes";

const NodeDescription = ({ description, isEditingDescription, setIsEditingDescription, handleDescriptionChange, handleDescriptionBlur }) => {
  const textAreaRef = useRef(null);

  useEffect(() => {
    if (isEditingDescription && textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, [isEditingDescription]);

  return (
    <Box
      flexGrow="1"
      style={{
        background: "var(--gray-a2)",
        border: "1px dashed var(--gray-a7)",
        position: 'relative',
        borderRadius: 'var(--radius-2)',
        padding: '10px'
      }}
      onClick={() => setIsEditingDescription(true)}
    >
      <Heading mb="1" size="3">
        Description
      </Heading>
      {isEditingDescription ? (
        <TextArea
          value={description}
          onChange={handleDescriptionChange}
          onBlur={handleDescriptionBlur}
          ref={textAreaRef}
          style={{ width: '100%', height: 'calc(100% - 22px)', minHeight: "100px", borderRadius: 'var(--radius-2)' }}
        />
      ) : (
        <ScrollArea type="auto" style={{ height: "calc(100% - 22px)", minHeight: "100px" }}>
          <Text>
            {description}
          </Text>
        </ScrollArea>
      )}
    </Box>
  );
};

export default NodeDescription;
