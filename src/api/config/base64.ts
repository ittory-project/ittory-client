// 편지 아이디
export const encodeLetterId = (id: number) => btoa(id.toString());
export const decodeLetterId = (encodedId: string) =>
  parseInt(atob(encodedId), 10);
