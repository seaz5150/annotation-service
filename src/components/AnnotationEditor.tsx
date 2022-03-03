import React, { Fragment, useEffect, useState } from "react";
import { pressStopPropagation, recordingJson } from "../CommonUtilities";
import { v4 as uuidv4 } from "uuid";

interface EditorEntity {
    id: string,
    text: string,
    tags?: Array<string>
}

const AnnotationEditor = () => {
    const [entities, setEntities] = useState<Array<EditorEntity>>();
    let editorId = uuidv4();

    useEffect(() => {
        let newEntities = Array<EditorEntity>();
        for (let index in recordingJson.transcript.segments[0].words) {
            let word: any = recordingJson.transcript.segments[0].words[index];
            let newEntity = {id: uuidv4(), text: word.label, tags: (word.textTags ? word.textTags : Array<string>())} as EditorEntity;
            newEntities.push(newEntity);
        }
        setEntities(newEntities);
    }, []);

    const reformatEntities = () => {
        console.log(window.getSelection()?.getRangeAt(0).cloneContents());
        let selector = '[data-editor-id="' + editorId + '"]';
        let editorElement = document.querySelector(selector);
        if (editorElement === null) return;

        let newEntities = Array<EditorEntity>();
        let childNodes = Array.from(editorElement.childNodes);
        for (let i in childNodes) {
            let childNode = childNodes[i];
            let textContent = childNode.textContent;

            let words = textContent?.split(" ");
            words = words?.map(word => word.trim());
            words = words?.filter(word => word.trim().length > 0);

            for (let j in words) {
                let word = words[Number(j)];
                let newEntity = {id: uuidv4(), text: word} as EditorEntity;

                newEntities.push(newEntity);
            }
        }
        console.log(newEntities);
        setEntities(newEntities);
    }

    return (  
    <div className="segment-text"
         data-editor-id={editorId}
         contentEditable="true"
         suppressContentEditableWarning={true}
         onBlur={reformatEntities}
         onMouseDown={e => pressStopPropagation(e)}>
                {entities &&
                    entities.map((entity: EditorEntity) => 
                        entity.tags && entity.tags?.length > 0 
                        ?
                        <mark style={{backgroundColor: '#84d2ff', padding: '0 4px'}}>
                            <span key={entity.id} data-id={entity.id} data-tags={entity.tags}>{entity.text} </span>
                        </mark>
                        : 
                        <span key={entity.id} data-id={entity.id}>{entity.text} </span>
                )}
    </div>
    );
}

export default AnnotationEditor;

