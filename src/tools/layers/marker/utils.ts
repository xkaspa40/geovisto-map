import { Marker } from "leaflet";

export const mergeSubValues = (
    subValues1: Record<string, number>,
    subValues2: Record<string, number>,
): Record<string, number> => {
    const subValues = { ...subValues1 };
    Object.entries(subValues2).forEach(([key, value]) => {
        subValues[key] = subValues[key] == null ? value : subValues[key] + value;
    });
    return subValues;
};

export const thousandsSeparator = (number: number): string => {
    // eslint-disable-next-line prefer-const
    let [wholePart, fractionPart] = number.toString().split(".");
    wholePart = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return fractionPart ? `${wholePart}.${fractionPart}` : `${wholePart}`;
};

export const createMarkerPopupContent = (name: string, value: number, subValues: number): string => {
    let popupMsg = `
      <b>${name}</b><br />
      ${value != null ? thousandsSeparator(value) : "N/A"}<br />
    `;
    for (const [key, subValue] of Object.entries(subValues)) {
        popupMsg += `${key}: ${subValue != null ? thousandsSeparator(subValue) : '-'}<br />`;
    }
    return popupMsg;
};

type MarkerData = {
    id: string,
    value: number,
    subvalues: Record<string, number>,
}
export const createClusterMarkersData = (markers: Marker[]): MarkerData =>
    markers.reduce((acc: MarkerData, marker: any) => {
        const { value: markerValue, subvalues: markerSubValues } = marker.options.icon.options.values;
        const subvalues = mergeSubValues(acc.subvalues, markerSubValues);
        return { ...acc, value: acc.value + markerValue, subvalues };
    }, { id: "<Group>", value: 0, subvalues: {} });
