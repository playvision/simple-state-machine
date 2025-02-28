import {Box, Text, Button, Flex, IconButton, AlertDialog, TextField} from "@radix-ui/themes";
import React, {useEffect, useState} from "react";
import useNodesStore from "../NodeStore.ts";
import {nanoid} from "nanoid";
import {CheckIcon, Cross2Icon, Pencil1Icon} from "@radix-ui/react-icons";
import {useShallow} from "zustand/react/shallow";

const selector = (state) => ({
  nodes: state.nodes,
  tags: state.tags,
  setTags: state.setTags,
  setNodes: state.setNodes,
});

const TagsEditor: React.FC = () => {
  const { nodes, tags, setTags, setNodes } = useNodesStore(useShallow(selector));

  const addTag = () => {
    const newTag = {
      name: `newTag_${nanoid(4)}`,
      color: '#787878',
    }
    setTags([...tags, newTag]);
  };

  const removeTag = (name: string) => {
    const newNodes = [];
    for (const node of nodes) {
      if (node.data.tag === name) {
        continue;
      }
      const tagIndex = node.data.tags?.findIndex((tag) => tag === name);
      if (tagIndex >= 0) {
        [...node.data.tags].splice(tagIndex, 1);
      }
      newNodes.push(node);
    }
    setNodes(newNodes);
    setTags(tags.filter((tag) => tag.name !== name));
  };

  const [editingTagName, setEditingTagName] = useState('');
  const [editingText, setEditingText] = useState('');
  const [editingTextInvalid, setEditingTextInvalid] = useState(false);
  const [editingColor, setEditingColor] = useState('');

  useEffect(() => {
    if (editingText !== editingTagName && tags.some((tag) => tag.name === editingText)) {
      setEditingTextInvalid(true);
    } else {
      setEditingTextInvalid(false);
    }
  }, [editingText]);

  const saveTag = (oldName: string, name: string, color: string) => {
    setTags(tags.map((tag) => {
      return tag.name === oldName
        ? {
          name: editingTextInvalid ? oldName : name,
          color,
        }
        : tag;
    }));
    if (editingTextInvalid || oldName === name) {
      return;
    }

    const newNodes = [];
    for (const node of nodes) {
      if (node.data.tag === oldName) {
        node.data.tag = name;
      } else {
        const tagIndex = node.data.tags?.findIndex((tag) => tag === oldName);
        if (tagIndex >= 0) {
          [...node.data.tags].splice(tagIndex, 1, name);
        }
      }
      newNodes.push(node);
    }
    setNodes(newNodes);
  };

  return (
      <Flex direction="column" gap="3">
        {tags.map((tag) =>
          <Flex key={tag.name} justify="between" align="center" p="1" px="3" style={{ border: `2px solid ${tag.color}`, borderRadius: '4px' }}>
            {editingTagName === tag.name && (
              <>
                <input type="color" value={editingColor} onChange={(event) => {setEditingColor(event.target.value)}}/>
                <Flex direction="column">
                  <TextField.Root
                    radius="large"
                    placeholder="TagName"
                    value={editingText}
                    onChange={(event) => {
                      setEditingText(event.target.value);
                    }}
                    style={{ color: editingColor }}
                  />
                  {editingTextInvalid && <Text color="red">Tag name must be unique</Text>}
                </Flex>
                <AlertDialog.Root>
                  <AlertDialog.Trigger>
                    <IconButton variant="ghost" color="crimson" radius="full" style={{ cursor: "pointer" }}>
                      <Cross2Icon />
                    </IconButton>
                  </AlertDialog.Trigger>
                  <AlertDialog.Content maxWidth="450px">
                    <AlertDialog.Title>Delete tag</AlertDialog.Title>
                    <AlertDialog.Description size="2">
                      Delete tag <b>{tag.name}</b> and all its mentions in nodes?<br/>
                      This action cannot be undone.
                    </AlertDialog.Description>

                    <Flex gap="3" mt="4" justify="end">
                      <AlertDialog.Cancel>
                        <Button variant="soft" color="gray">
                          Cancel
                        </Button>
                      </AlertDialog.Cancel>
                      <AlertDialog.Action>
                        <Button variant="solid" color="red" onClick={() => removeTag(tag.name)}>
                          Delete
                        </Button>
                      </AlertDialog.Action>
                    </Flex>
                  </AlertDialog.Content>
                </AlertDialog.Root>
                <IconButton variant="ghost" color="grass" radius="full" style={{ cursor: "pointer" }} onClick={() => {
                  saveTag(editingTagName, editingText, editingColor);
                  setEditingTextInvalid(false);
                  setEditingTagName('');
                  setEditingText('');
                  setEditingColor('');
                }}>
                  <CheckIcon />
                </IconButton>
              </>
            )}
            {editingTagName !== tag.name && (
              <>
                <Box></Box>
                <Text style={{ color: tag.color }}>{tag.name}</Text>
                <IconButton variant="ghost" color="gray" radius="full" style={{ cursor: "pointer" }} onClick={() => {
                  setEditingTextInvalid(false);
                  setEditingTagName(tag.name);
                  setEditingColor(tag.color);
                  setEditingText(tag.name);
                }}>
                  <Pencil1Icon />
                </IconButton>
              </>
            )}
          </Flex>
        )}
        <Button onClick={addTag}>Add tag</Button>
      </Flex>
  );
};

export default TagsEditor;