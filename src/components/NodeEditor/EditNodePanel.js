import React, { useState, useEffect, useRef } from "react";
import {Flex, Button, CheckboxGroup, AlertDialog} from "@radix-ui/themes";
import useNodesStore from "../../NodeStore.ts";
import NodeIdField from "./NodeIdField.js";
import NodeImage from "./NodeImage.js";
import NodeDescription from "./NodeDescription.js";
import {useReactFlow} from "@xyflow/react";

export default function EditNodePanel() {
  const {
    tags,
    getSelectedNode,
    isNodeIdUnique,
    updateNodeId,
    updateNodeData,
  } = useNodesStore();
  const { deleteElements } = useReactFlow();

  const selectedNode = getSelectedNode();
  const [newNodeId, setNewNodeId] = useState(
    selectedNode ? selectedNode.id : ""
  );
  const [description, setDescription] = useState(
    selectedNode ? selectedNode.data.description : ""
  );
  const [image, setImage] = useState(
    selectedNode ? selectedNode.data.image : ""
  );
  const [nodeTags, setNodeTags] = useState(
    selectedNode ? (selectedNode.data.tags || []) : [],
  );
  const [isUnique, setIsUnique] = useState(true);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  const fileInputRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (selectedNode) {
      setNewNodeId(selectedNode.id);
      setDescription(selectedNode.data.description);
      setImage(selectedNode.data.image);
      setNodeTags(selectedNode.data.tags || []);
    }
  }, [selectedNode]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsEditingDescription(false);
        if (selectedNode) {
          updateNodeData(selectedNode.id, { description });
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedNode, description]);

  const handleIdChange = (e) => {
    const newId = e.target.value;
    setNewNodeId(newId);
    setIsUnique(isNodeIdUnique(newId));
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result.toString());
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage("");
  };

  const handleSave = () => {
    if (selectedNode && isUnique) {
      updateNodeId(selectedNode.id, newNodeId);
      updateNodeData(selectedNode.id, {
        description,
        image,
        tags: nodeTags,
      });
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleDescriptionBlur = () => {
    setIsEditingDescription(false);
    if (selectedNode) {
      updateNodeData(selectedNode.id, { description });
    }
  };

  const removeSelectedNode = () => {
    void deleteElements({
      nodes: [selectedNode],
    });
  };

  return (
    <Flex direction="column" gap="3" ref={panelRef} flexGrow="1">
      {selectedNode && selectedNode.type === 'baseGameNode' && (
        <>
          <NodeIdField
            newNodeId={newNodeId}
            isUnique={isUnique}
            handleIdChange={handleIdChange}
          />
          <NodeImage
            image={image}
            handleRemoveImage={handleRemoveImage}
            handleUploadClick={handleUploadClick}
            fileInputRef={fileInputRef}
            handleImageChange={handleImageChange}
          />
          <NodeDescription
            description={description}
            isEditingDescription={isEditingDescription}
            setIsEditingDescription={setIsEditingDescription}
            handleDescriptionChange={handleDescriptionChange}
            handleDescriptionBlur={handleDescriptionBlur}
          />
          <CheckboxGroup.Root defaultValue={nodeTags} name="tags" onValueChange={(value) => {
            setNodeTags(value);
            updateNodeData(selectedNode.id, {
              description: selectedNode.description,
              image: selectedNode.image,
              tags: value,
            });
          }}>
            {tags.map((tag) =>
              <CheckboxGroup.Item key={tag.name} value={tag.name} style={{ color: tag.color }}>{tag.name}</CheckboxGroup.Item>
            )}
          </CheckboxGroup.Root>
        </>
      )}
      {selectedNode && selectedNode.type !== 'anyStateNode' && (
        <Button
          variant="soft"
          disabled={!selectedNode || !isUnique}
          color="green"
          onClick={handleSave}
        >
          Save
        </Button>
      )}

      <AlertDialog.Root>
        <AlertDialog.Trigger>
          <Button
            variant="soft"
            disabled={!selectedNode}
            color="red"
          >
            Remove selected node
          </Button>
        </AlertDialog.Trigger>
        <AlertDialog.Content maxWidth="450px">
          <AlertDialog.Title>Delete node</AlertDialog.Title>
          <AlertDialog.Description size="2">
            Delete node <b>{selectedNode.id}</b> and all its connections?<br/>
            This action cannot be undone.
          </AlertDialog.Description>

          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button variant="solid" color="red" onClick={removeSelectedNode}>
                Delete
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </Flex>
  );
}
