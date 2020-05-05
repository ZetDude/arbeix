import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { setNamed, setTab } from '../actions/menu';
import Menu from '../components/Menu';
import { menuStateTypeInternal } from '../reducers/types';

type menuStateType = {
  menu: menuStateTypeInternal;
};

function mapStateToProps(state: menuStateType) {
  return {
    menu: state.menu
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(
    {
      setTab,
      setNamed,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
