export const SET = 'SET_TAB';

export function setTab(to: number) {
  return {
    type: SET,
    value: to
  };
}
