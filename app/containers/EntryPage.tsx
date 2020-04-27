import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import Entries from '../components/Entries';
import {
  indent,
  dedent,
} from '../actions/entries';
import { entryStateTypeInternal } from '../reducers/types';

type entriesStateType = {
  entries: entryStateTypeInternal
};

function mapStateToProps(state: entriesStateType) {
  return {
    entries: state.entries,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(
    {
      indent,
      dedent,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Entries);
