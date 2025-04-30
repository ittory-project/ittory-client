export const formatObjectString = (obj: object) => {
  return JSON.stringify(obj, null, '\t').replace(/\\n/g, '\n');
};
