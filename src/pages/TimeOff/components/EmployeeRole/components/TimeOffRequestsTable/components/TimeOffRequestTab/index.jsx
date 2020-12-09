import React, { PureComponent } from 'react';
import EmptyIcon from '@/assets/timeOffTableEmptyIcon.svg';
import DataTable from '../DataTable';
import CompoffTable from '../CompoffTable';
import FilterBar from '../FilterBar';
import styles from './index.less';

export default class mockDataTimeOffRequestTab extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedFilterTab: '1',
      inProgressData: [],
      rejectedData: [],
      approvedData: [],
      draftData: [],
    };
  }

  componentDidMount = () => {
    const { data = [] } = this.props;
    this.progressData(data);
  };

  setSelectedFilterTab = (id) => {
    this.setState({
      selectedFilterTab: id,
    });
  };

  progressData = (originalData) => {
    const inProgressData = [];
    const approvedData = [];
    const rejectedData = [];
    const draftData = [];

    originalData.forEach((row) => {
      const { status = '' } = row;
      switch (status) {
        case 'IN-PROGRESS': {
          inProgressData.push(row);
          break;
        }
        case 'APPROVED': {
          approvedData.push(row);
          break;
        }
        case 'REJECTED': {
          rejectedData.push(row);
          break;
        }
        case 'DRAFTS': {
          draftData.push(row);
          break;
        }
        default:
          break;
      }
    });
    this.setState({
      inProgressData,
      approvedData,
      rejectedData,
      draftData,
    });
  };

  render() {
    const { selectedFilterTab, inProgressData, approvedData, rejectedData, draftData } = this.state;
    const { data = [], type = 0 } = this.props;

    const dataNumber = {
      inProgressNumber: inProgressData.length,
      approvedNumber: approvedData.length,
      rejectedNumber: rejectedData.length,
      draftNumber: draftData.length,
    };

    return (
      <div className={styles.TimeOffRequestTab}>
        <FilterBar dataNumber={dataNumber} setSelectedFilterTab={this.setSelectedFilterTab} />
        <div className={styles.tableContainer}>
          {data.length === 0 ? (
            <div className={styles.emptyTable}>
              <img src={EmptyIcon} alt="empty-table" />
              <p className={styles.describeTexts}>
                You have not applied for any Leave requests. <br />
                Submitted Casual, Sick & Compoff requests will be displayed here.
              </p>
            </div>
          ) : (
            <div>
              {type === 1 && (
                <>
                  {selectedFilterTab === '1' ? <DataTable data={inProgressData} /> : ''}
                  {selectedFilterTab === '2' ? <DataTable data={approvedData} /> : ''}
                  {selectedFilterTab === '3' ? <DataTable data={rejectedData} /> : ''}
                  {selectedFilterTab === '4' ? <DataTable data={draftData} /> : ''}
                </>
              )}
              {type === 2 && (
                <>
                  {selectedFilterTab === '1' ? <CompoffTable data={inProgressData} /> : ''}
                  {selectedFilterTab === '2' ? <CompoffTable data={approvedData} /> : ''}
                  {selectedFilterTab === '3' ? <CompoffTable data={rejectedData} /> : ''}
                  {selectedFilterTab === '4' ? <CompoffTable data={draftData} /> : ''}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}
