import React, { useState } from 'react';
import { Button, Flex, ScrollArea, Text, Code } from "@radix-ui/themes";
import { Dialog } from '@radix-ui/themes';
import useNodesStore from "../NodeStore.ts";

const ExportConfigDialog: React.FC = () => {
  const generateConfig = useNodesStore((state) => state.generateConfig);
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<string>("");

  const handleExport = () => {
    const generatedConfig = generateConfig();
    setConfig(JSON.stringify(generatedConfig, null, 2));
    setIsOpen(true);
  };

  const handleDownload = () => {
    const blob = new Blob([config], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'state_machine_config.json';
    a.click();
    URL.revokeObjectURL(url);
    setIsOpen(false);
  };

  return (
    <>
      <Button variant="soft" color="blue" onClick={handleExport}>
        Export Config
      </Button>

      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Trigger>
          <Button style={{ display: 'none' }}>Hidden Trigger</Button>
        </Dialog.Trigger>
        <Dialog.Content style={{ width: '90vw', height: '90vh', overflow: 'hidden' }}>
          <Dialog.Title>Export Config</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Below is the generated configuration for your state machine. You can review it before downloading.
          </Dialog.Description>
          <ScrollArea type="always" scrollbars="vertical" style={{ height: '70vh', width: '100%' }}>
            <Code style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
              {config}
            </Code>
          </ScrollArea>
          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Close
              </Button>
            </Dialog.Close>
            <Button onClick={handleDownload}>
              Download
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
};

export default ExportConfigDialog;
