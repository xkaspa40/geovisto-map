export const path = (path: string, obj: Record<string, unknown>): any => path.split('.').reduce((o, i) => o[i], obj);
