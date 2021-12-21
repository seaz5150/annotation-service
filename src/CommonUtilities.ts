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

export const rgbaToHexAlpha = (value: number) => {
    return (Math.floor(value * 255)).toString(16);
}