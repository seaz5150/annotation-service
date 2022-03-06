import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { pressStopPropagation, recordingJson } from "../CommonUtilities";
import { v4 as uuidv4 } from "uuid";
import { createEditor, BaseEditor, Descendant, Selection, Transforms, Editor, Range, Text, Element, Point } from 'slate'
import { Slate, Editable, withReact, ReactEditor } from 'slate-react'
import Leaf from "slate-react/dist/components/leaf";

// interface EditorEntity {
//     id: string,
//     text: string,
//     tags?: Array<string>
// }


export type TagElement = {
  type?: any
  tagLabels?: string[]
  tagId?: string,
  children?: any
}

type CustomText = { text: string, tagLabels?: string[], tagId?: string }

export type CustomElement = TagElement;

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
}

interface AnnotationEditorInterface {
  words: any
}

const AnnotationEditor = (props: AnnotationEditorInterface) => {
  let initialValue: Descendant[] = [
    {
      type: 'paragraph',
      children: [{text: ""}],
    },
  ]

  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState<Descendant[]>();

  let tagColors: { [name: string]: string } = {};
  tagColors["command"] = "rgba(245, 40, 145, 0.8)";
  tagColors["argument"] = "rgba(245, 255, 0, 0.8)";
  tagColors["third"] = "yellow";


  useEffect(() => {
    let paragraphChildren = (initialValue[0] as any).children;
    let currentTag;
    let lastTag;
    for (let index in props.words) {
      let currentWord = props.words[index];
      currentTag = currentWord.textTags ? currentWord.textTags[0] : null;

      if (currentTag !== lastTag) {
        if (paragraphChildren.length !== 1) {
          paragraphChildren.push({text: " "});
        }
        paragraphChildren.push({text: currentWord.label, tagLabels: currentTag ? [currentTag] : undefined, tagId: currentTag ? uuidv4() : undefined});
      }
      else {
        paragraphChildren[paragraphChildren.length - 1].text = paragraphChildren[paragraphChildren.length - 1].text + " " + currentWord.label;
      }

      if (Number(index) === props.words - 1) {
        paragraphChildren.push({text: ""});
      }

      lastTag = currentTag;
    }
    setValue(initialValue);
  }, []);

  const Leaf = useCallback(({ attributes, children, leaf }) => {
    let tagLabels = leaf.tagLabels;
    if (tagLabels && tagLabels.length > 0) {
      return <mark {...attributes} className="text-tag" style={{backgroundColor: tagColors[tagLabels[0]]}}>
              <span>{children}</span>
              <span contentEditable={false} className="text-tag-label">{tagLabels[0]}</span>
              <button onClick={() => deleteTag(leaf.tagId)} contentEditable={false} className="strip-button-style text-tag-delete-button">
                <i className="bi bi-x"></i>
              </button>
              </mark>
    }
    else {
      return <span {...attributes}>{children}</span>;
    }
  }, []);

  const deleteTag = (tagId: number) => {
    const children = (editor.children[0] as any).children as any[];

    for (let index in children) {
      let child = children[Number(index)];

      if (child.tagId !== null && child.tagId === tagId) {
        Transforms.setNodes(editor, {tagLabels: undefined, tagId: undefined}, {at: [0, Number(index)], match: Text.isText, split: true});
        break;
      }
    }
  };

  const tagSelection = (labelName: string) => {
    let selection = editor.selection;
    if (selection == null) {
      return null;
    }

    let selectionAnchor = JSON.parse(JSON.stringify(selection.anchor));
    let selectionFocus = JSON.parse(JSON.stringify(selection.focus));
    if (Range.isBackward(selection)) {
      let selectionTemp = selectionAnchor;
      selectionAnchor = selectionFocus;
      selectionFocus = selectionTemp;
    }

    const topLevelBlockNodesInSelection = Editor.nodes(editor, {
      mode: "lowest",
    });

    let nodeEntry = topLevelBlockNodesInSelection.next();
    let alreadyTagged = false;
    while (!nodeEntry.done) {
      const [node, path] = nodeEntry.value;
      if ((node as any).tagLabels && (node as any).tagLabels.length > 0) {
        alreadyTagged = true;
        break;
      }

      let nodeText = (node as any).text;

      let currentNodeIsAnchor = false;
      let currentNodeIsFocus = false;
      if (selectionAnchor?.path[0] === path[0] && selectionAnchor?.path[1] === path[1]) {
        currentNodeIsAnchor = true;
      }
      if (selectionFocus?.path[0] === path[0] && selectionFocus?.path[1] === path[1]) {
        currentNodeIsFocus = true;
      }

      if (currentNodeIsAnchor) {
        let lastSpaceIndex = nodeText.lastIndexOf(" ", selectionAnchor.offset);
        if (lastSpaceIndex !== -1) {
          selectionAnchor.offset = lastSpaceIndex + 1;
        }
        else {
          selectionAnchor.offset = 0;
        }
      }
      if (currentNodeIsFocus) {
        let nextSpaceIndex = nodeText.indexOf(" ", selectionFocus.offset);
        if (nextSpaceIndex !== -1) {
          selectionFocus.offset = nextSpaceIndex;
        }
        else {
          selectionFocus.offset = nodeText.length;
        }
      }

      nodeEntry = topLevelBlockNodesInSelection.next();
    }

    if (!alreadyTagged) {
      let selectedText = Editor.string(editor, {
        anchor: selectionAnchor,
        focus: selectionFocus,
      });

      if (selectedText.replace(/\s/g, '').length > 0) {
        Transforms.select(editor, {
          anchor: selectionAnchor,
          focus: selectionFocus,
        })
  
        editor.addMark("tagLabels", [labelName]);
        editor.addMark("tagId", uuidv4());
      }
    }
  };

  return (
    <div>
      {value &&
        <Slate editor={editor} value={value} onChange={newValue => setValue(newValue)}>
          <Editable onMouseDown={pressStopPropagation} renderLeaf={Leaf} />
        </Slate>
      }
      <button onMouseDown={() => tagSelection("command")}>First</button>
      <button onMouseDown={() => tagSelection("argument")}>Second</button>
      <pre>{JSON.stringify(value, null, 2)}</pre>
    </div>
  );
}

export default AnnotationEditor;
