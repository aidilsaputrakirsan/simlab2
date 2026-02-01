export const generateQueryStringFromObject = (params: Record<string, string | number | boolean | undefined | null>) => {
    const queryString = new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
            // Skip undefined and null values
            if (value !== undefined && value !== null) {
                acc[key] = String(value);
            }
            return acc;
        }, {} as Record<string, string>)
    ).toString()

    return queryString
}