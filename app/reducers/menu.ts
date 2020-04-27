import { AnyAction } from 'redux';
import { SET } from '../actions/menu';

export default function counter(state = 0, action: AnyAction) {
  if (action.type === SET) {
    return action.value;
  }
  return state;
}
