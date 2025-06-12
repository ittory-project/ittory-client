export const printSafeArea = () => {
  const el = document.createElement('div');
  el.style.cssText = `
  position: fixed;
  top: 0; left: 0;
  width: 0; height: 0;
  padding-top: env(safe-area-inset-top);
  padding-right: env(safe-area-inset-right);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  visibility: hidden;
  pointer-events: none;
  z-index: -1;
`;
  document.body.appendChild(el);

  const style = getComputedStyle(el);

  const safeAreaTop = style.paddingTop;
  const safeAreaRight = style.paddingRight;
  const safeAreaBottom = style.paddingBottom;
  const safeAreaLeft = style.paddingLeft;

  console.log('safe-area-inset-top:', safeAreaTop);
  console.log('safe-area-inset-right:', safeAreaRight);
  console.log('safe-area-inset-bottom:', safeAreaBottom);
  console.log('safe-area-inset-left:', safeAreaLeft);

  document.body.removeChild(el);
};
