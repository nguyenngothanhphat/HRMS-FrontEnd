import { Select, Button } from 'antd';
import React, { PureComponent } from 'react';
import PlusIcon from '@/assets/plusIcon.svg';
import { connect } from 'umi';
import EachType from '../EachType';
import s from './index.less';

const { Option } = Select;

@connect(({ timeOff: { countryList = [] } = {} }) => ({
  countryList,
}))
class TimeOffTypes extends PureComponent {
  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'timeOff/getCountryList',
    });
  };

  _renderSelectCountry = () => {
    const { countryList } = this.props;
    return (
      <div className={s.selectCountry}>
        <div className={s.selectBox}>
          <span className={s.title}>Set timeoff type for each company location</span>
          <Select
            placeholder="Choose country"
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {countryList.map((country) => {
              const { _id = '', name = '' } = country;
              return <Option value={_id}>{name}</Option>;
            })}
          </Select>
        </div>
        <div className={s.saveButton}>
          <Button>Save</Button>
        </div>
      </div>
    );
  };

  _renderTimeoffTypes = () => {
    return (
      <div className={s.timeoffTypesContainer}>
        <EachType />
        <EachType />
      </div>
    );
  };

  _renderAddTimeoffTypeButton = () => {
    return (
      <div className={s.addTimeoffTypeBtn}>
        <img src={PlusIcon} alt="add" />
        <span>Add Timeoff Type</span>
      </div>
    );
  };

  render() {
    return (
      <div className={s.TimeOffTypes}>
        {this._renderSelectCountry()}
        {this._renderTimeoffTypes()}
        {this._renderAddTimeoffTypeButton()}
      </div>
    );
  }
}
export default TimeOffTypes;
