import { Select, Button } from 'antd';
import React, { PureComponent } from 'react';
import PlusIcon from '@/assets/plusIcon.svg';
import { connect } from 'umi';
import EachType from '../EachType';
import s from './index.less';

const { Option } = Select;

@connect(({ timeOff: { countryList = [], setupPack = [], selectedConfigCountry = '' } = {} }) => ({
  countryList,
  setupPack,
  selectedConfigCountry,
}))
class TimeOffTypes extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedCountry: '',
    };
  }

  componentDidMount = () => {
    const { dispatch, selectedConfigCountry = '' } = this.props;
    dispatch({
      type: 'timeOff/getCountryList',
    });
    this.setState({
      selectedCountry: selectedConfigCountry,
    });
  };

  // GET COUNTRY OBJECT BY ID
  getCountryById = (_id) => {
    const { countryList } = this.props;
    const result = countryList.filter((data) => data._id === _id);
    if (result.length > 0) {
      return result[0];
    }
    return {};
  };

  // ON COUNTRY CHANGE
  onCountryChange = (_id) => {
    const obj = this.getCountryById(_id);
    this.setState({
      selectedCountry: obj.name,
    });

    const { dispatch } = this.props;
    dispatch({
      type: 'timeOff/save',
      payload: {
        selectedConfigCountry: _id,
      },
    });
  };

  // RENDER
  _renderSelectCountry = () => {
    const { countryList = [], selectedConfigCountry = '', setupPack = [] } = this.props;
    const checkValidationSaveBtn = setupPack.length > 0;

    return (
      <div className={s.selectCountry}>
        <div className={s.selectBox}>
          <span className={s.title}>Set timeoff type for each company location</span>
          <Select
            placeholder="Choose country"
            // showSearch
            defaultValue={selectedConfigCountry}
            optionFilterProp="children"
            onChange={this.onCountryChange}
            filterOption={(input, option) =>
              option.children.props.children[1].props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0}
          >
            {countryList.map((country) => {
              const { _id = '', name = '', flag = '' } = country;
              return (
                <Option value={_id}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div
                      style={{
                        minWidth: '24px',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <img style={{ width: '170%' }} src={flag} alt="flag" />
                    </div>
                    <span
                      style={{
                        display: 'inline-block',
                        marginLeft: '10px',
                        fontSize: '13px',
                        fontWeight: 500,
                        color: '#2C6DF9',
                      }}
                    >
                      {name}
                    </span>
                  </div>
                </Option>
              );
            })}
          </Select>
        </div>
        <div className={s.saveButton}>
          <Button disabled={!checkValidationSaveBtn}>Save</Button>
        </div>
      </div>
    );
  };

  _renderTimeoffTypes = () => {
    const { setupPack = [] } = this.props;
    return (
      <div className={setupPack.length > 0 ? s.timeoffTypesContainer : ''}>
        {setupPack.map((value, index) => {
          return <EachType data={value} dataIndex={index} />;
        })}
      </div>
    );
  };

  addButton = () => {
    const { dispatch, setupPack = [] } = this.props;
    dispatch({
      type: 'timeOff/save',
      payload: {
        setupPack: [
          ...setupPack,
          {
            shortType: null,
            totalPerYear: 0,
            whenToAdd: 'year',
            name: '',
          },
        ],
      },
    });
  };

  _renderAddTimeoffTypeButton = () => {
    const { selectedCountry } = this.state;
    const check = selectedCountry !== '' && selectedCountry !== null;
    return (
      <div
        className={check ? s.addTimeoffTypeBtn : s.disabledButton}
        onClick={check ? this.addButton : () => {}}
      >
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
