import { Input, Select, Radio } from 'antd';
import React, { PureComponent } from 'react';

import { connect } from 'umi';
import { DeleteOutlined } from '@ant-design/icons';
import s from './index.less';

const { Option } = Select;

@connect(({ timeOff: { defaultTimeoffTypesList = [] } = {} }) => ({
  defaultTimeoffTypesList,
}))
class EachType extends PureComponent {
  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'timeOff/getDefaultTimeoffTypesList',
    });
  };

  _renderList = () => {
    const { defaultTimeoffTypesList = [] } = this.props;
    return (
      <div className={s.abovePart}>
        <div className={s.selectBox}>
          <Select
            showSearch
            optionFilterProp="children"
            placeholder="Choose timeoff type"
            filterOption={(input, option) =>
              option.children.props.children[0].toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {defaultTimeoffTypesList.map((value) => {
              const { shortType = '', id = '', name = '' } = value;
              return (
                <Option value={id}>
                  <span style={{ fontSize: '13px' }}>
                    {name} ({shortType})
                  </span>
                </Option>
              );
            })}
          </Select>
        </div>
        <div className={s.deleteButton}>
          <DeleteOutlined />
          <span className={s.label}>Delete</span>
        </div>
      </div>
    );
  };

  _renderConfigTimeoffType = () => {
    const options = [
      { label: 'Month', value: 'month' },
      { label: 'Year', value: 'year' },
    ];
    return (
      <div className={s.belowPart}>
        <div className={s.totalPerYear}>
          Total Casual or Annual Leave per year {'   '}
          <Input value={12} />
          {'  '}
          days/year
        </div>
        <div className={s.timeToAdd}>
          Casual or annual leave is added on the first day of {'  '}
          <Radio.Group
            options={options}
            // onChange={this.onChange1}
            value="year"
            optionType="button"
            buttonStyle="solid"
          />
        </div>
      </div>
    );
  };

  render() {
    return (
      <div className={s.EachType}>
        {this._renderList()}
        {this._renderConfigTimeoffType()}
      </div>
    );
  }
}
export default EachType;
