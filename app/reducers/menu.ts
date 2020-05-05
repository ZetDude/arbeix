import { AnyAction } from 'redux';
import { AUTO_UPDATE, NAMED, SET } from '../actions/menu';
import { defaultMenuStateTypeInternal } from './types';

export default function menu(state = defaultMenuStateTypeInternal, action: AnyAction) {
  if (action.type === SET) {
    return {
      ...state,
      named: undefined,
      tab: action.value
    }
  } else if (action.type === NAMED) {
    return {
      ...state,
      tab: -1,
      named: action.value
    }
  } else if (action.type === AUTO_UPDATE) {
    return {
      ...state,
      autoUpdate: action.value
    }
  }
  return state;
}
