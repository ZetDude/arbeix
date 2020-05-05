export const SET = 'SET_TAB';
export const NAMED = "SET_NAMED_TAB";

export function setTab(to: number) {
  return {
    type: SET,
    value: to
  };
}

export function setNamed(to: string) {
  return {
    type: NAMED,
    value: to
  }
}
