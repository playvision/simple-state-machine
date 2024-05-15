import React, { useState } from 'react';
import { Button, Container } from "@radix-ui/themes";
import useNodesStore from "../NodeStore.ts";

const ExportProjectButton: React.FC = () => {
  const generateProjectFile = useNodesStore((state) => state.generateProjectFile);
  const [isProjectGenerated, setIsProjectGenerated] = useState(false);

  const handleExport = () => {
    const projectData = generateProjectFile();
    const blob = new Blob([projectData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project.json';
    a.click();
    URL.revokeObjectURL(url);
    setIsProjectGenerated(true);
  };

  return (
    <div style={{width: '100%'}}>
    <Button style={{width: '100%'}} variant="soft"  onClick={handleExport} disabled={isProjectGenerated}>
      Export Project
    </Button>
    </div>
  );
};

export default ExportProjectButton;
