import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import Details from '../components/Details';

function mapStateToProps(state: any) {
  return {
    entries: state.entries
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(
    {},
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Details);
