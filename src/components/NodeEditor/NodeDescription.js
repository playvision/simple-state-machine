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
          style={{ width: '100%', height: '150px', borderRadius: 'var(--radius-2)' }}
        />
      ) : (
        <ScrollArea style={{ height: '150px', overflow: 'auto', padding: '10px' }}>
          <Text>
            {description}
          </Text>
        </ScrollArea>
      )}
    </Box>
  );
};

export default NodeDescription;
