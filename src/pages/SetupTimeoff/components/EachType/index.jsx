import { Select } from 'antd';
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

  _renderConfigTimeoffType = () => {
    return <div className={s.belowPart}>Heyyyy</div>;
  };

  render() {
    const { defaultTimeoffTypesList = [] } = this.props;
    return (
      <div className={s.EachType}>
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
        {this._renderConfigTimeoffType()}
      </div>
    );
  }
}
export default EachType;
