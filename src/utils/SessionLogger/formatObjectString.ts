export const formatObjectString = (obj: unknown) => {
  // NOTE: Type 정의와 다르게, JSON.stringify()의 입력으로 undefined가 전달되면 값을 반환하지 않음(=undefined 반환)
  return JSON.stringify(obj, null, '\t')?.replace(/\\n/g, '\n');
};
