import { useCallback, useEffect, useMemo, useState } from "react";
import { pressStopPropagation } from "../../utils/CommonUtilities";
import { v4 as uuidv4 } from "uuid";
import { createEditor, BaseEditor, Descendant, Transforms, Editor, Range, Text } from 'slate'
import { Slate, Editable, withReact, ReactEditor} from 'slate-react'
import { History, HistoryEditor, withHistory } from 'slate-history'
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../../state/Index";

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

interface AnnotationTextEditorInterface {
  words: any,
  textTags: [{label: string, id: string, color: string}],
  unpairedTags: [{label: string, id: string, color: string}],
  segmentId: string
}

const AnnotationTextEditor = (props: AnnotationTextEditorInterface) => {
  const dispatch = useDispatch();
  const { createActionHistoryAddAction,
          createActionEditorSaveData,
          createActionTranscriptSegmentUpdate,
          createActionTranscriptIncreaseAmountUpdated,
          createActionEditorPopData,
          createActionTranscriptInputEditorSplitInfo,
          createActionEditorSetFocusedEditor } = bindActionCreators(actionCreators, dispatch);
        
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

  const segment = useSelector((state: any) => state.recordingTranscript.segments.find((segment: { id: string; }) => segment.id === props.segmentId));

  const editor = useSelector((state: any) => state.editor);
  const history = useSelector((state: any) => state.history);
  const transcript = useSelector((state: any) => state.recordingTranscript);
  const job = useSelector((state: any) => state.job);

  const [historyPrevious, setHistoryPrevious] = useState<History | null>(null);

  // Used for forcing editor re-render.
  const [key, setKey] = useState(uuidv4());

  useEffect(() => {
    if (historyPrevious === null) {
      setHistoryPrevious(JSON.parse(JSON.stringify(slateEditor.history)));
    }
    else {
      let currentUndos = slateEditor.history.undos;
      if ((currentUndos.length + slateEditor.history.redos.length) > (historyPrevious.undos.length + historyPrevious.redos.length)) {
        // Slate adds selection changes to the history - remove that.
        let lastUndo = currentUndos[currentUndos.length - 1];
        if (lastUndo && (lastUndo.length === 1) && (lastUndo[0].type === "set_selection")) {
          slateEditor.history.undos.pop();
        }
        else {
          setHistoryPrevious(JSON.parse(JSON.stringify(slateEditor.history)));
          createActionHistoryAddAction("AnnotationTextEditor", props.segmentId);
        }
      }
    }
  }, [slateEditor.history.undos.length]);

  useEffect(() => {
    if (editor.editorData) {
      var segmentData = editor.editorData.filter((d: { id: string; }) => d.id === props.segmentId);
      if (segmentData && segmentData.length > 0) {
        loadSavedData();
        return;
      }
    }
    initializeText();
  }, []);

  const loadSavedData = () => {
    if (editor.editorData) {
      var segmentData = editor.editorData.filter((d: { id: string; }) => d.id === props.segmentId);
      if (segmentData && segmentData.length > 0) {
        var mostRecentSegmentData = segmentData.reduce((previous: { order: number; }, current: { order: number; }) => (+previous.order > +current.order) ? previous : current);
        if (mostRecentSegmentData) {
          HistoryEditor.withoutSaving(slateEditor, () => Transforms.select(slateEditor, {
            anchor: {path: [0,0], offset: 0},
            focus: {path: [0,0], offset: 0},
          }));
          setValue(mostRecentSegmentData.value);
          setHistoryPrevious(JSON.parse(JSON.stringify(mostRecentSegmentData.history)));
          slateEditor.history = mostRecentSegmentData.history;
          setTimeout(() => {createActionEditorPopData(props.segmentId, mostRecentSegmentData.order);}, 10);
        }
      }
    }
  };

  useEffect(() => {
    switch (history.type) {
      case "HISTORY_REDO_ACTION":
        var historyItem = history.actionHistory[history.currentActionIndex];
        if (historyItem.componentName === "AnnotationTextEditor" && historyItem.segmentId === props.segmentId) {
          slateEditor.redo();
        }
        break;
      case "HISTORY_UNDO_ACTION":
        var historyItem = history.actionHistory[history.currentActionIndex + 1];
        if (historyItem.componentName === "AnnotationTextEditor" && historyItem.segmentId === props.segmentId) {
          slateEditor.undo();
        }
        break;
    }
  }, [history]);

  useEffect(() => {
    switch (transcript.type) {
      case "TRANSCRIPT_UPDATE_WORDS":
        createActionTranscriptSegmentUpdate(props.segmentId, undefined, undefined, undefined, undefined, parseWords());
        createActionTranscriptIncreaseAmountUpdated();
        break;
      case "TRANSCRIPT_GATHER_SPLIT_INFO":
        inputSplitInfo();
        break;
    }
  }, [transcript]);

  const inputSplitInfo = () => {
    if (editor.focusedEditorSegmentId === props.segmentId) {
      if (Range.isCollapsed(slateEditor.selection as Range)) {
        let children = JSON.parse(JSON.stringify((value as any)[0].children));
        let wordCount = 0;
        let selectedChildIndex = Number(slateEditor.selection?.anchor.path[1]);
        let characterIndex = Number(slateEditor.selection?.anchor.offset);
        let splitWord = false;

        for (let i in children) {
          if (Number(i) > selectedChildIndex) {
            break;
          }
          let currentChildText = children[i].text;

          if (currentChildText.trim().length === 0) {
            continue;
          }

          if (Number(i) === selectedChildIndex) {
            let splitTextStart = currentChildText.substring(0, characterIndex);
            let splitTextStartWords = splitTextStart.split(" ");
            splitTextStartWords = splitTextStartWords.filter((w: string) => w.trim().length !== 0);
            let splitTextStartWordsCount = splitTextStartWords.length;

            let splitTextEnd = currentChildText.substring(characterIndex, currentChildText.length);
            let splitTextEndWords = splitTextEnd.split(" ");
            splitTextEndWords = splitTextEndWords.filter((w: string) => w.trim().length !== 0);
            let splitTextEndWordsCount = splitTextEndWords.length;

            if ((splitTextStartWordsCount + splitTextEndWordsCount) > currentChildText.split(" ").length) {
              splitWord = true;
            }
            wordCount += splitTextStartWordsCount;
          }
          else {
            let currentWords = currentChildText.split(" ");
            currentWords = currentWords.map((w: string) => w.trim().length !== 0);
            let currentWordsCount = currentWords.length;

            wordCount += currentWordsCount;
          }
        }
        createActionTranscriptInputEditorSplitInfo(props.segmentId, wordCount, splitWord)
      }
    }
  };

  const parseWords = () => {
    let children = JSON.parse(JSON.stringify((value as any)[0].children));
    let result = [] as any[];

    for (let i in children) {
      let currentChild = children[i];
      let childText;
      if (currentChild.unpairedTag) {
        childText = currentChild.tagLabels[0];
      }
      else {
        childText = currentChild.text;
      }
      let childLabels = currentChild.tagLabels as string[];

      if (childText.trim().length > 0) {
        let splitWords = childText.split(" ");
        splitWords = splitWords.filter((w: string) => w !== "");

        for (let j in splitWords) {
          let currentWord = splitWords[j];
          let newWord = {label: currentWord, start: null, end: null, confidence: null, text_tags: []} as any;
          
          if (!currentChild.unpairedTag && childLabels) {
            if (splitWords.length === 1) {
              newWord.text_tags = ["!START_" + childLabels[0], "!END_" + childLabels[0]];
            }
            else {
              if (Number(j) === 0) {
                newWord.text_tags = ["!START_" + childLabels[0]];
              }
              else if (Number(j) === splitWords.length - 1) {
                newWord.text_tags = ["!END_" + childLabels[0]];
              }
              else {
                newWord.text_tags = ["!IN_" + childLabels[0]];
              }
            }
          }
          result.push(newWord);
        }
      }
    }
    return result;
  };

  useEffect(() => {
    switch (editor.type) {
      case "EDITOR_ADD_SECTION_TAG":
        tagSelection(editor.tagId);
        break;
      case "EDITOR_ADD_UNPAIRED_TAG":
        insertUnpairedTag(editor.tagId);
        break;
      case "EDITOR_REQUEST_DATA_SAVE":
        if (editor.segmentId === props.segmentId) {
          createActionEditorSaveData(props.segmentId, slateEditor.history, value);
        }
        break;
      case "EDITOR_REINITIALIZE_WORDS":
        if (editor.segmentIds.find((segmentId: string) => segmentId === props.segmentId)) {
          initializeText();
          setKey(uuidv4());
        }
        break;
      case "EDITOR_REINITIALIZE_WORDS_FROM_SAVED":
        if (editor.segmentIds.find((segmentId: string) => segmentId === props.segmentId)) {
          loadSavedData();
          setKey(uuidv4());
        }
        break;
    }
  }, [editor]);

  const initializeText = () => {
    let paragraphChildren = (initialValue[0] as any).children;
    let currentTags;
    let lastTags;

    let words = segment.words;

    if (words && words.length === 0) {
      paragraphChildren.push({text: ""});
    }

    for (let i in words) {
      let currentWord = words[i];
      let matchedUnpairedTag = job.unpairedTags.find((u: { id: string; }) => u.id === currentWord.label);
      let matchedUnpairedTagLabel = matchedUnpairedTag && matchedUnpairedTag.label;

      if (matchedUnpairedTagLabel) {
        paragraphChildren.push({text: "[" + matchedUnpairedTagLabel + "]", tagLabels: [currentWord.label], tagId: uuidv4(), unpairedTag: true});
        if (paragraphChildren.length !== 0) {
          paragraphChildren.push({text: " "});
        }
        continue;
      }

      currentTags = currentWord.text_tags;
      if (currentTags.length === 0) {
        if (lastTags && lastTags.length === 0) {
          paragraphChildren[paragraphChildren.length - 1].text = paragraphChildren[paragraphChildren.length - 1].text + " " + currentWord.label;
        }
        else {
          if (paragraphChildren.length !== 0) {
            paragraphChildren.push({text: " "});
          }
          paragraphChildren.push({text: currentWord.label, tagLabels: undefined, tagId: uuidv4()});
        }
      }
      else if (currentTags.length === 1) {
        let currentTag = currentTags[0];
        let currentTagSplit = currentTag.split("_");
        let currentTagPrefix = currentTagSplit[0];
        let tagWithoutPrefix = currentTagSplit[1];
        if (currentTagPrefix === "!START") {
          if (paragraphChildren.length !== 0) {
            paragraphChildren.push({text: " "});
          }
          paragraphChildren.push({text: currentWord.label, tagLabels: [tagWithoutPrefix], tagId: uuidv4()});
        }
        else {
          paragraphChildren[paragraphChildren.length - 1].text = paragraphChildren[paragraphChildren.length - 1].text + " " + currentWord.label;
        }
      }   
      else if (currentTags.length === 2) {
        if (paragraphChildren.length !== 0) {
          paragraphChildren.push({text: " "});
        }
        let tagWithoutPrefix = currentTags[0].split("_")[1];
        paragraphChildren.push({text: currentWord.label, tagLabels: [tagWithoutPrefix], tagId: uuidv4()});
      }

      if (Number(i) === props.words - 1) {
        paragraphChildren.push({text: ""});
      }
      lastTags = currentTags;
    }
    
    HistoryEditor.withoutSaving(slateEditor, () => Transforms.select(slateEditor, {
      anchor: {path: [0,0], offset: 0},
      focus: {path: [0,0], offset: 0},
    }));
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
        const textTag = textTags.find(tag => tag.label === tagLabels[0]);
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
      if (editor.focusedEditorSegmentId !== props.segmentId) return;
      if (!slateEditor.selection) return;

      const unpairedTag = unpairedTags?.find(tag => tag.id === tagId);
      Transforms.insertNodes(slateEditor, {text: "[" + unpairedTag?.label + "]", tagLabels: [tagId], tagId: uuidv4(), unpairedTag: true}, {mode: "lowest"});
      setTimeout(() => {createActionEditorSetFocusedEditor(props.segmentId)}, 100);
  };

  const tagSelection = (tagId: string) => {
    if (editor.focusedEditorSegmentId !== props.segmentId) return;
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
    while (!nodeEntry.done) {
      const [node, path] = nodeEntry.value;

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

    setTimeout(() => {createActionEditorSetFocusedEditor(props.segmentId)}, 100);
  };

  return (
    <div className="annotation-editor-wrapper" 
         onFocus={() => createActionEditorSetFocusedEditor(props.segmentId)}>
      {value &&
        <Slate key={key} editor={slateEditor} value={value} onChange={newValue => setValue(newValue)}>
          <Editable onMouseDown={pressStopPropagation} renderLeaf={leaf} />
        </Slate>
      }
      {/* <pre>{JSON.stringify(value, null, 2)}</pre> */}
    </div>
  );
}

export default AnnotationTextEditor;
