import { useCallback, useEffect, useMemo, useState } from "react";
import { pressStopPropagation } from "../CommonUtilities";
import { v4 as uuidv4 } from "uuid";
import { createEditor, BaseEditor, Descendant, Transforms, Editor, Range, Text } from 'slate'
import { Slate, Editable, withReact, ReactEditor } from 'slate-react'
import { useSelector } from "react-redux";

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
  words: any,
  textTags: [{label: string, id: string, color: string}]
}

const AnnotationEditor = (props: AnnotationEditorInterface) => {
  let initialValue: Descendant[] = [
    {
      type: 'paragraph',
      children: [{text: ""}],
    },
  ]

  const slateEditor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState<Descendant[]>();
  const textTags = props.textTags;
  const words = props.words;
  const editor = useSelector((state: any) => state.editor);

  useEffect(() => {
    initializeText();
  }, []);

  useEffect(() => {
    switch (editor.type) {
      case "EDITOR_ADD_SECTION_TAG":
          tagSelection(editor.tagId);
          break;
    }
  }, [editor]);

  const initializeText = () => {
    let paragraphChildren = (initialValue[0] as any).children;
    let currentTag;
    let lastTag;
    for (let index in words) {
      let currentWord = words[index];
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
  };

  const leaf = useCallback(({ attributes, children, leaf }) => {
    let tagLabels = leaf.tagLabels;
    if (tagLabels && tagLabels.length > 0) {
      const textTag = textTags.find(tag => tag.id === tagLabels[0]);
      return <mark {...attributes} className="text-tag" style={{backgroundColor: textTag?.color}}>
              <span>{children}</span>
              <span contentEditable={false} className="text-tag-label">{textTag?.label}</span>
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
    const children = (slateEditor.children[0] as any).children as any[];

    for (let index in children) {
      let child = children[Number(index)];

      if (child.tagId !== null && child.tagId === tagId) {
        Transforms.setNodes(slateEditor, {tagLabels: undefined, tagId: undefined}, {at: [0, Number(index)], match: Text.isText, split: true});
        break;
      }
    }
  };

  const tagSelection = (labelName: string) => {
    let selection = slateEditor.selection;
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

    const topLevelBlockNodesInSelection = Editor.nodes(slateEditor, {
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
      let selectedText = Editor.string(slateEditor, {
        anchor: selectionAnchor,
        focus: selectionFocus,
      });

      if (selectedText.replace(/\s/g, '').length > 0) {
        Transforms.select(slateEditor, {
          anchor: selectionAnchor,
          focus: selectionFocus,
        })
  
        slateEditor.addMark("tagLabels", [labelName]);
        slateEditor.addMark("tagId", uuidv4());
      }
    }
  };

  return (
    <div>
      {value &&
        <Slate editor={slateEditor} value={value} onChange={newValue => setValue(newValue)}>
          <Editable onMouseDown={pressStopPropagation} renderLeaf={leaf} />
        </Slate>
      }
      {/* <pre>{JSON.stringify(value, null, 2)}</pre> */}
    </div>
  );
}

export default AnnotationEditor;
