export const SET = 'SET_TAB';
export const NAMED = "SET_NAMED_TAB";
export const AUTO_UPDATE = "SET_AUTO_UPDATE_STATE";
export const UpdateIdle = 0;
export const UpdateChecking = 1;
export const UpdateAvailable = 2;

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

export function autoUpdateState(to: number) {
  return {
    type: AUTO_UPDATE,
    value: to,
  }
}
