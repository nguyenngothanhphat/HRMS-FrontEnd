import React from 'react';
import { Select, Row, Col } from 'antd';
import { connect } from 'dva';
import { Debounce } from 'lodash-decorators/debounce';
import styles from './index.less';

const { Option } = Select;

@connect(({ googleMap }) => ({ googleMap }))
class SearchLocation extends React.PureComponent {
  constructor(props) {
    super(props);

    const { value = { placeID: '', address: '' } } = props;
    this.state = {
      ...value,
    };
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if ('value' in nextProps) {
      const { googleMap: { list } = { list: [] }, value = {} } = nextProps;
      const { placeID, address } = value;

      if (
        placeID &&
        Array.isArray(list) &&
        !list.find(prediction => prediction.place_id === placeID)
      )
        list.push({ place_id: placeID, description: address });

      return {
        ...nextState,
        list,
        ...(value || {}),
      };
    }
    return null;
  }

  handleChange = placeid => {
    const { dispatch, onChange } = this.props;
    dispatch({ type: 'googleMap/fetchDetail', payload: { placeid, onChange } });
  };

  @Debounce(600)
  handleSearch(input) {
    if (typeof input === 'string' && input.length < 2) return;
    const { dispatch } = this.props;
    dispatch({
      type: 'googleMap/searchLocation',
      payload: { input },
    });
  }

  render() {
    const { placeholder, delIcon } = this.props;
    const { placeID, list } = this.state;
    const options = list.map(prediction => (
      <Option key={prediction.place_id}>{prediction.description}</Option>
    ));
    return (
      <Row gutter={12}>
        <Col span={22}>
          <Select
            className={styles.select}
            showSearch
            value={placeID}
            placeholder={placeholder}
            defaultActiveFirstOption={false}
            filterOption={false}
            onSearch={value => this.handleSearch(value)}
            onChange={this.handleChange}
            notFoundContent={null}
            showArrow={false}
          >
            {options}
          </Select>
        </Col>
        <Col span={2}>{delIcon}</Col>
      </Row>
    );
  }
}

export default SearchLocation;
