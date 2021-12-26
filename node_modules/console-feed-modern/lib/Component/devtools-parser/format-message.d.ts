/**
 * @param {string} format
 * @param {!Array.<!SDK.RemoteObject>} parameters
 * @param {!Element} formattedResult
 */
export default function formatWithSubstitutionString(format: any, parameters: any, formattedResult: any): {
    formattedResult: any;
    unusedSubstitutions: any;
};
