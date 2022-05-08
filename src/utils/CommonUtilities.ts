import moment from "moment";

export const getFormattedTime = (timeSeconds: number | undefined) => {
    if (timeSeconds) {
        const timeMiliseconds = Math.floor(timeSeconds * 1000);
        const timeDuration = moment.duration(timeMiliseconds);
        return moment.utc(timeDuration.as("milliseconds")).format("mm:ss.S");
    }
    else {
        return "00:00.0";
    }
}

// RGBA alpha to hex alpha conversion.
export const rgbaToHexAlpha = (value: number) => {
    return (Math.floor(value * 255)).toString(16);
}

// Stop propagation of event.
export const pressStopPropagation = (e: any) => {
    e.stopPropagation();
}

// Get from local storage.
export function getFromLS(key: string) {
    let ls;
    if (global.localStorage) {
        try {
        let parsedLs = global.localStorage.getItem(key);
        if (parsedLs) {
            ls = parsedLs as string;
        }
        } catch (e) {}
    }
    if (ls) {
        return JSON.parse(ls as string);
    }
}

// Save to local storage.
export function saveToLS(key: any, value: any) {
    if (global.localStorage) {
        global.localStorage.setItem(
        key,
        JSON.stringify(value));
    }
}