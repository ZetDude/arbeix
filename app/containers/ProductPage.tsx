import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import Products from '../components/Products';
import { categoryInput, commitSchema, createCategory, updateSchema } from '../actions/products';
import { productStateTypeInternal } from '../reducers/types';

type productStateType = {
  products: productStateTypeInternal
};

function mapStateToProps(state: productStateType) {
  return {
    products: state.products,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators({
    categoryInput,
    createCategory,
    updateSchema,
    commitSchema,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Products);
