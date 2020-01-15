export const formatNumber = (value: number, precision: number = 2): number => {
    return Number(value.toFixed(precision));
};

export const poorDeepEqual = (v1: object | object[], v2: object | object[]) => {
    return JSON.stringify(v1) === JSON.stringify(v2);
};

export const isValidNumber = (value: string): boolean => /^\d*[.]{0,1}\d{0,2}$/.test(value)

export const clearLeadingZeros = (value: string): string => {
    if (/^0\d.*$/.test(value)) {
        return value.replace(/^0+/, '');
    }
    return value;
};
