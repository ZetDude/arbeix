export const INDENT = 'INDENT';
export const DEDENT = 'DEDENT';

export function dedent() {
  return {
    type: DEDENT
  };
}

export function indent(pathName: string) {
  return {
    type: INDENT,
    pathAddition: pathName
  };
}
