import { Input, Select, Radio } from 'antd';
import React, { PureComponent } from 'react';

import { connect } from 'umi';
import { DeleteOutlined } from '@ant-design/icons';
import s from './index.less';

const { Option } = Select;

@connect(({ timeOff: { defaultTimeoffTypesList = [], setupPack = [] } = {} }) => ({
  defaultTimeoffTypesList,
  setupPack,
}))
class EachType extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isTypeSelected: false,
      hovering: false,
    };
  }

  componentDidMount = () => {
    const { dispatch, data: { shortType: shortTypeData = '' } = {} } = this.props;
    dispatch({
      type: 'timeOff/getDefaultTimeoffTypesList',
    });
    this.setState({
      isTypeSelected: shortTypeData !== null && shortTypeData !== '',
    });
  };

  deleteButton = () => {
    const { dispatch, dataIndex = 0, setupPack = [] } = this.props;
    const newSetupPack = setupPack.filter((value, index) => index !== dataIndex);
    dispatch({
      type: 'timeOff/save',
      payload: {
        setupPack: [...newSetupPack],
      },
    });
  };

  isHover = (value) => {
    this.setState({
      hovering: value,
    });
  };

  // GET TYPE OBJECT BY ID
  getTypeByShortType = (shortType) => {
    const { defaultTimeoffTypesList = [] } = this.props;
    const result = defaultTimeoffTypesList.filter((data) => data.shortType === shortType);
    if (result.length > 0) {
      return result[0];
    }
    return {};
  };

  // ON DATA CHANGE FUNCTIONS
  onTypeChange = (shortType) => {
    const typeObj = this.getTypeByShortType(shortType);
    const { dispatch, dataIndex = 0, setupPack = [] } = this.props;
    setupPack[dataIndex].shortType = typeObj.shortType;
    setupPack[dataIndex].name = typeObj.name;
    dispatch({
      type: 'timeOff/save',
      payload: {
        setupPack: [...setupPack],
      },
    });
    this.setState({
      isTypeSelected: true,
    });
  };

  onTotalChange = (e) => {
    const { target: { value = '' } = {} } = e;
    const { dispatch, dataIndex = 0, setupPack = [] } = this.props;
    setupPack[dataIndex].totalPerYear = parseFloat(value) || 0;
    dispatch({
      type: 'timeOff/save',
      payload: {
        setupPack: [...setupPack],
      },
    });
  };

  onWhenChange = (e) => {
    const { target: { value = '' } = {} } = e;
    const { dispatch, dataIndex = 0, setupPack = [] } = this.props;
    setupPack[dataIndex].whenToAdd = value;
    dispatch({
      type: 'timeOff/save',
      payload: {
        setupPack: [...setupPack],
      },
    });
  };

  // RENDER
  _renderList = () => {
    const {
      defaultTimeoffTypesList = [],
      data: { shortType: shortTypeData = '' } = {},
    } = this.props;
    return (
      <div className={s.abovePart}>
        <div className={s.selectBox}>
          <Select
            showSearch
            optionFilterProp="children"
            value={shortTypeData}
            placeholder="Choose timeoff type"
            onChange={this.onTypeChange}
            filterOption={(input, option) =>
              option.children.props.children[0].toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {defaultTimeoffTypesList.map((value) => {
              const { shortType = '', name = '' } = value;
              return (
                <Option value={shortType}>
                  <span style={{ fontSize: '13px' }}>
                    {name} ({shortType})
                  </span>
                </Option>
              );
            })}
          </Select>
        </div>
        <div
          className={s.deleteButton}
          onMouseEnter={() => this.isHover(true)}
          onMouseLeave={() => this.isHover(false)}
          onClick={this.deleteButton}
        >
          <DeleteOutlined />
          <span className={s.label}>Delete</span>
        </div>
      </div>
    );
  };

  _renderConfigTimeoffType = () => {
    const { data: { totalPerYear = 0, whenToAdd = 'year', name = '' } = {} } = this.props;
    const options = [
      { label: 'Month', value: 'month' },
      { label: 'Year', value: 'year' },
    ];
    return (
      <div className={s.belowPart}>
        <div className={s.totalPerYear}>
          Total {name} per year
          <Input onChange={this.onTotalChange} value={totalPerYear} style={{ margin: '0 10px' }} />
          days/year
        </div>
        <div className={s.timeToAdd}>
          {name} is added on the first day of {'  '}
          <Radio.Group
            options={options}
            onChange={this.onWhenChange}
            value={whenToAdd}
            optionType="button"
            buttonStyle="solid"
          />
        </div>
      </div>
    );
  };

  render() {
    const { isTypeSelected } = this.state;
    const { hovering } = this.state;

    return (
      <div className={`${s.EachType} ${hovering ? s.hovering : ''}`}>
        {this._renderList()}
        {isTypeSelected && this._renderConfigTimeoffType()}
      </div>
    );
  }
}
export default EachType;
