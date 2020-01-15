export const formatNumber = (value: number, precision: number = 2): number => {
    return Number(value.toFixed(precision));
};

export const poorDeepEqual = (v1: object | object[], v2: object | object[]) => {
    return JSON.stringify(v1) === JSON.stringify(v2);
};
