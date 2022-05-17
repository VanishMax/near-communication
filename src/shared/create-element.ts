const composeClasses = (classes: string): string[] => {
  return classes.trim().split(' ');
};

const createElement = (tag: string, classes: string, children?: (HTMLElement| string)[]) => {
  const el = document.createElement(tag);
  if (classes) el.classList.add(...composeClasses(classes));

  if (children?.length) {
    children.forEach((child) => el.append(child));
  }

  return el;
};

export default createElement;
