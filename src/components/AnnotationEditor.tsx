import { useCallback, useEffect, useMemo, useState } from "react";
import { pressStopPropagation } from "../CommonUtilities";
import { v4 as uuidv4 } from "uuid";
import { createEditor, BaseEditor, Descendant, Transforms, Editor, Range, Text } from 'slate'
import { Slate, Editable, withReact, ReactEditor } from 'slate-react'
import { History, HistoryEditor, withHistory } from 'slate-history'
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../state";

// interface EditorEntity {
//     id: string,
//     text: string,
//     tags?: Array<string>
// }


export type TagElement = {
  type?: any,
  children?: any,
  text?: string,
  tagLabels?: string[]
  tagId?: string
}

type CustomText = { text: string, tagLabels?: string[], tagId?: string, unpairedTag: boolean }

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
  textTags: [{label: string, id: string, color: string}],
  unpairedTags: [{label: string, id: string, color: string}],
  segmentId: string
}

const AnnotationEditor = (props: AnnotationEditorInterface) => {
  const dispatch = useDispatch();
  const { createActionHistoryAddAction } = bindActionCreators(actionCreators, dispatch);
        
  let initialValue: Descendant[] = [
    {
      type: 'paragraph',
      children: [],
    },
  ]

  const slateEditor = useMemo(() => withReact(withHistory(createEditor())), []);
  const [value, setValue] = useState<Descendant[]>();

  const textTags = props.textTags;
  const unpairedTags = props.unpairedTags;
  const words = props.words;

  const editor = useSelector((state: any) => state.editor);
  const history = useSelector((state: any) => state.history);
  const transcript = useSelector((state: any) => state.recordingTranscript);

  const [editorFocused, setEditorFocused] = useState(false);
  const [historyPrevious, setHistoryPrevious] = useState<History | null>(null);

  useEffect(() => {
    if (historyPrevious === null) {
      setHistoryPrevious(JSON.parse(JSON.stringify(slateEditor.history)));
    }
    else {
      if ((slateEditor.history.undos.length + slateEditor.history.redos.length) > (historyPrevious.undos.length + historyPrevious.redos.length)) {
        setHistoryPrevious(JSON.parse(JSON.stringify(slateEditor.history)));
        createActionHistoryAddAction("AnnotationEditor", props.segmentId);
      }
    }
  }, [slateEditor.history.undos.length]);

  useEffect(() => {
    initializeText();
  }, []);

  useEffect(() => {
    switch (transcript.type) {
      case "TRANSCRIPT_SEGMENT_DELETE":
        if (history.actionHistory[history.currentActionIndex]?.segmentId === props.segmentId) {
          slateEditor.redo();
        }
        break;
    }
  }, [transcript]);

  useEffect(() => {
    switch (history.type) {
      case "HISTORY_REDO_ACTION":
        if (history.actionHistory[history.currentActionIndex]?.segmentId === props.segmentId) {
          slateEditor.redo();
        }
        break;
      case "HISTORY_UNDO_ACTION":
        if (history.actionHistory[history.currentActionIndex + 1]?.segmentId === props.segmentId) {
          slateEditor.undo();
        }
        break;
    }
  }, [history]);

  useEffect(() => {
    switch (editor.type) {
      case "EDITOR_ADD_SECTION_TAG":
        tagSelection(editor.tagId);
        break;
      case "EDITOR_ADD_UNPAIRED_TAG":
        insertUnpairedTag(editor.tagId);
        break;
    }
  }, [editor]);

  const initializeText = () => {
    let paragraphChildren = (initialValue[0] as any).children;
    let currentTag;
    let lastTag;

    if (words.length === 0) {
      paragraphChildren.push({text: ""});
    }

    for (let index in words) {
      let currentWord = words[index];
      currentTag = currentWord.textTags ? currentWord.textTags[0] : null;

      if (currentTag !== lastTag) {
        if (paragraphChildren.length !== 0) {
          paragraphChildren.push({text: " "});
        }
        paragraphChildren.push({text: currentWord.label, tagLabels: currentTag ? [currentTag] : undefined, tagId: uuidv4()});
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
      if (leaf.unpairedTag) {
        const unpairedTag = unpairedTags.find(tag => tag.id === tagLabels[0]);
        return <mark contentEditable={false} {...attributes} className="unpaired-tag" style={{backgroundColor: unpairedTag?.color}}>
                <span className="text-tag-label" contentEditable={false}>{children}</span>
                <button onClick={() => deleteTag(leaf.tagId)} contentEditable={false} className="strip-button-style text-tag-delete-button">
                  <i className="bi bi-x"></i>
                </button>
        </mark>
      }
      else {
        const textTag = textTags.find(tag => tag.id === tagLabels[0]);
        return <span {...attributes} className="text-tag" style={{borderColor: textTag?.color}}>
                <span className="text-tag-inside" style={{boxShadow: "inset 0px 0px 0px 1px " + textTag?.color}}>
                  <span className="text-tag-content" style={{backgroundColor: textTag?.color.substring(0, textTag?.color.length - 2) + "26"}}>{children}</span>
                  <span className="text-tag-info" style={{backgroundColor: textTag?.color}}>
                    <button onClick={() => deleteTag(leaf.tagId)} contentEditable={false} className="strip-button-style text-tag-delete-button">
                      <i className="bi bi-x"></i>
                    </button>
                  </span>
                </span>
               </span>
      }
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
        if (child.unpairedTag) {
          Transforms.removeNodes(slateEditor, {at: [0, Number(index)], match: Text.isText});
        }
        else {
          Transforms.setNodes(slateEditor, {tagLabels: undefined, tagId: undefined}, {at: [0, Number(index)], match: Text.isText, split: true});
          break;
        }
      }
    }
  };

  const insertUnpairedTag = (tagId: string) => {
      if (!editorFocused) return;
      if (!slateEditor.selection) return;

      const unpairedTag = unpairedTags?.find(tag => tag.id === tagId);
      Transforms.insertNodes(slateEditor, {text: "[" + unpairedTag?.label + "]", tagLabels: [tagId], tagId: uuidv4(), unpairedTag: true}, {mode: "lowest"});
      setTimeout(() => {setEditorFocused(true)}, 100);
  };

  const tagSelection = (tagId: string) => {
    if (!editorFocused) return;
    let selection = slateEditor.selection;
    if (!selection) return;

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
        HistoryEditor.withoutMerging(slateEditor, () => Transforms.select(slateEditor, {
          anchor: selectionAnchor,
          focus: selectionFocus,
        }));
  
        slateEditor.addMark("tagLabels", [tagId]);
        slateEditor.addMark("tagId", uuidv4());

        Transforms.collapse(slateEditor, {edge: "end"});
      }
    }
    setTimeout(() => {setEditorFocused(true)}, 100);
  };

  return (
    <div className="annotation-editor-wrapper" 
         onFocus={() => setEditorFocused(true)}
         onBlur={() => setEditorFocused(false)}>
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
