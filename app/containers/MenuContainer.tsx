import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { setTab } from '../actions/menu';
import Menu from '../components/Menu';

type menuStateType = {
  menu: number
};

function mapStateToProps(state: menuStateType) {
  return {
    menu: state.menu,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(
    {
      setTab,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
