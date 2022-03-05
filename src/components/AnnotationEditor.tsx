import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { pressStopPropagation, recordingJson } from "../CommonUtilities";
import { v4 as uuidv4 } from "uuid";
import { createEditor, BaseEditor, Descendant, Selection, Transforms, Editor } from 'slate'
import { Slate, Editable, withReact, ReactEditor } from 'slate-react'
import Leaf from "slate-react/dist/components/leaf";

// interface EditorEntity {
//     id: string,
//     text: string,
//     tags?: Array<string>
// }


export type TagElement = {
  type: any
  tagLabels?: string[]
  children: any
}

type CustomText = { text: string }

export type CustomElement = TagElement;

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
}

const AnnotationEditor = () => {
  const initialValue: Descendant[] = [
    {
      type: 'paragraph',
      children: [
        { text: 'This is editable ' },
        { text: 'rich', tagLabels: ["first", "second", "third"] },
        { text: ' text, ' },
        { text: 'much', tagLabels: ["second"]},
        { text: ' better than a ' },
        { text: '<textarea>', tagLabels: ["first"] },
        { text: '!' },
      ],
    },
  ]

  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState<Descendant[]>(initialValue);

  let tagColors: { [name: string]: string } = {};
  tagColors["first"] = "red";
  tagColors["second"] = "green";
  tagColors["third"] = "yellow";

  // const [entities, setEntities] = useState<Array<EditorEntity>>();
  // useEffect(() => {
  //     let newEntities = Array<EditorEntity>();
  //     for (let index in recordingJson.transcript.segments[0].words) {
  //         let word: any = recordingJson.transcript.segments[0].words[index];
  //         let newEntity = {id: uuidv4(), text: word.label, tags: (word.textTags ? word.textTags : Array<string>())} as EditorEntity;
  //         newEntities.push(newEntity);
  //     }
  //     setEntities(newEntities);
  // }, []);

  const renderElement = useCallback(({ attributes, children, element }) => {
    switch (element.type) {
      case "tag":
        let paddingPx = children.length * 2;
        const tagStyle = {
          backgroundColor: element.tagLabel,
          padding: paddingPx + "px",
          borderRadius: "0.2em"
        };
        return <span style={tagStyle} {...attributes}>{children}</span>
      default:
        return <span {...attributes}>{children}</span>
    }
  }, []);

  const Leaf = useCallback(({ attributes, children, leaf }) => {
    let tagLabels = leaf.tagLabels;
    if (tagLabels) {
      for (let index in tagLabels) {
        let currentTagLabel = tagLabels[index];
        let padding = 2 + Number(index);
        children = <span style={{backgroundColor: tagColors[currentTagLabel], padding: padding + "px", borderRadius: "0.2em"}}>{children}</span>
      }
    }
    return <span {...attributes}>{children}</span>
  }, []);

  const getSelection = () => {
    let selection = editor.selection;
    // let selected;
    // console.log("lul");
    // if (selection !== null && selection.anchor !== null) {
    //   console.log(selection.anchor)
    //   console.log(editor.children);
    //   selected = editor.children[selection.anchor.path[0]];
    // } else {
    //   selected = null;
    // }
    // console.log(selected);
    //Editor.addMarkAtRange()
  };

  return (
    <>
      <Slate editor={editor} value={value} onChange={newValue => setValue(newValue)}>
        <Editable onMouseDown={pressStopPropagation} renderLeaf={Leaf}/>
      </Slate>
      <button onMouseDown={getSelection}>Style</button>
      <pre>{JSON.stringify(value, null, 2)}</pre>
    </>
  );
}

export default AnnotationEditor;
