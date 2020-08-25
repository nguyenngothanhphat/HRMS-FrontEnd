import React, { PureComponent } from 'react';
import { Form } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import PageLoading from '@/components/PageLoading';
import LayoutContent from '@/layouts/LayoutContent';
import BillForm from './components/NewExpenseForm';
import MileageForm from './components/MileageForm';

@Form.create()
@connect(({ bill, loading, exchangeRate, type }) => ({
  bill,
  loading: loading.effects['bill/fetchItem'],
  exchangeRate,
  type,
}))
class NewBill extends PureComponent {
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { action },
      },
    } = this.props;
    if (action !== 'add') {
      dispatch({ type: 'bill/fetchItem', payload: action });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'bill/save', payload: { item: {} } });
  }

  render() {
    const {
      match,
      loading = false,
      bill: { item },
      type: typeProps,
      exchangeRate,
      dispatch,
      saving,
    } = this.props;
    let {
      params: { type },
    } = match;
    const types = {
      expense: {
        name: formatMessage({ id: 'bill.form.basic' }),
        component: props => <BillForm {...props} />,
        link: '/expense/travel/add',
        alt: 'Create new expense',
      },
      mileage: {
        name: formatMessage({ id: 'bill.form.mileage' }),
        component: props => <MileageForm {...props} />,
        link: '/expense/mileage/add',
        alt: 'Create new mileage expense',
      },
    };
    if (type !== 'mileage') type = 'expense';

    return (
      <LayoutContent
        tabs={Object.keys(types).map(typePage => {
          const tab = types[typePage];
          const { name, link, component } = tab;
          const content = !loading ? (
            component({ match, dispatch, exchangeRate, type: typeProps, item, loading, saving })
          ) : (
            <PageLoading />
          );
          return { name, link, content, key: typePage };
        })}
        activeKey={type}
      />
    );
  }
}

export default NewBill;
