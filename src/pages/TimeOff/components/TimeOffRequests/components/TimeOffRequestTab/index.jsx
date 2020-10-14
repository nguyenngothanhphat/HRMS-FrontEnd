import React, { PureComponent } from 'react';
import TimeOffTable from '../TimeOffRequestTable';
import FilterBar from '../FilterBar';
import styles from './index.less';

export default class TimeOffRequestTab extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedFilterTab: '1',
      inProgressData: [],
      onHoldData: [],
      acceptedData: [],
      rejectedData: [],
    };
  }

  componentDidMount = () => {
    const { data } = this.props;
    this.progressData(data);
  };

  setSelectedFilterTab = (id) => {
    this.setState({
      selectedFilterTab: id,
    });
  };

  progressData = (originalData) => {
    const inProgressData = [];
    const onHoldData = [];
    const acceptedData = [];
    const rejectedData = [];

    originalData.forEach((row) => {
      switch (row.status) {
        case 1: {
          inProgressData.push(row);
          break;
        }
        case 2: {
          onHoldData.push(row);
          break;
        }
        case 3: {
          acceptedData.push(row);
          break;
        }
        case 4: {
          rejectedData.push(row);
          break;
        }
        default:
          break;
      }
    });
    this.setState({
      inProgressData,
      onHoldData,
      acceptedData,
      rejectedData,
    });
  };

  render() {
    const {
      selectedFilterTab,
      inProgressData,
      onHoldData,
      acceptedData,
      rejectedData,
    } = this.state;

    const dataNumber = {
      inProgressNumber: inProgressData.length,
      onHoldNumber: onHoldData.length,
      acceptedNumber: acceptedData.length,
      rejectedNumber: rejectedData.length,
    };
    return (
      <div className={styles.TimeOffRequestTab}>
        <FilterBar dataNumber={dataNumber} setSelectedFilterTab={this.setSelectedFilterTab} />
        <div className={styles.tableContainer}>
          {selectedFilterTab === '1' ? <TimeOffTable data={inProgressData} /> : ''}
          {selectedFilterTab === '2' ? <TimeOffTable data={onHoldData} /> : ''}
          {selectedFilterTab === '3' ? <TimeOffTable data={acceptedData} /> : ''}
          {selectedFilterTab === '4' ? <TimeOffTable data={rejectedData} /> : ''}
        </div>
      </div>
    );
  }
}
