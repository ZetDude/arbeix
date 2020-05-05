import { AnyAction } from 'redux';
import { NAMED, SET } from '../actions/menu';
import { defaultMenuStateTypeInternal } from './types';

export default function menu(state = defaultMenuStateTypeInternal, action: AnyAction) {
  if (action.type === SET) {
    return {
      named: undefined,
      tab: action.value
    }
  } else if (action.type === NAMED) {
    return {
      tab: -1,
      named: action.value
    }
  }
  return state;
}
