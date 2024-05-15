import React from 'react';
import { Button, IconButton, Tooltip } from "@radix-ui/themes";
import useNodesStore from "../NodeStore.ts";
import { FilePlusIcon } from '@radix-ui/react-icons';

const ImportProjectButton: React.FC = () => {
  const loadProjectFile = useNodesStore((state) => state.loadProjectFile);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        if (text) {
          loadProjectFile(text);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <>
      <input
        style={{ display: 'none' }}
        type="file"
        accept=".json"
        id="import-project-json"
        onChange={handleFileUpload}
      />
      <label htmlFor="import-project-json">
      <Tooltip content="Import project file">
        <IconButton variant="soft" onClick={() => {
            const input = document.getElementById("import-project-json");
            if (input) {
                input.click();
            }
        }}>
          <FilePlusIcon />
        </IconButton>
        </Tooltip>
      </label>
    </>
  );
};

export default ImportProjectButton;
