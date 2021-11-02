import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Popover, Input, Button, Table, Form, Row, Col } from 'antd';
import React, { PureComponent } from 'react';
import { Link, connect } from 'umi';
import moment from 'moment';
import NotesFilter from './components/NotesFilter';
import styles from './index.less';
import cancelIcon from '../../../../assets/cancelIcon.svg';
import { FilterIcon } from './components/FilterIcon';
import { getCurrentTenant } from '@/utils/authority';

@connect(
  ({
    loading,
    employee: { listEmployeeActive = [] } = {},
    locationSelection: { listLocationsByCompany = [] } = {},
    user: { companiesOfUser = [], currentUser: { _id = '', firstName = '' } = {} } = {},
    customerProfile: { info: { customerId = '' } = {}, notes = [] } = {},
  }) => ({
    loadingNotes: loading.effects['customerProfile/fetchNotes'],
    notes,
    listEmployeeActive,
    customerId,
    _id,
    firstName,
    listLocationsByCompany,
    companiesOfUser,
  }),
)
class Notes extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isUnhide: false,
    };
  }

  componentDidMount() {
    const { dispatch, customerId, companiesOfUser, listLocationsByCompany } = this.props;
    dispatch({
      type: 'customerProfile/fetchNotes',
      payload: {
        id: customerId,
      },
    });

    dispatch({
      type: 'employee/fetchListEmployeeActive',
      payload: {
        company: companiesOfUser,
        location: listLocationsByCompany,
      },
    });
  }

  handleVisible = () => {
    const { isUnhide } = this.state;
    this.setState({
      isUnhide: !isUnhide,
    });
  };

  showModal = () => {
    const { visible } = this.state;
    this.setState({
      visible: !visible,
    });
  };

  closeModal = () => {
    const { visible } = this.state;
    this.setState({
      visible: !visible,
    });
  };

  generateColumns = () => {
    const columns = [
      {
        // title: 'Project ID',
        dataIndex: 'text',
        align: 'left',
        fixed: 'left',
        width: '10%',
        render: (text, item) => {
          const time = moment(item.created_at).format('DD MMM, YY');
          return (
            <div className={styles.tableRow}>
              <div className={styles.itemTop}>
                <p className={styles.itemTopTitle}>{text}</p>
                <Link>{item.owner}</Link>
                <span style={{ textTransform: 'capitalize' }} className={styles.itemSpan}>
                  {time}
                </span>
              </div>
            </div>
          );
        },
      },
    ];

    return columns.map((col) => ({
      ...col,
      title: col.title,
    }));
  };

  addNote = (values) => {
    const { dispatch, _id, firstName, reId } = this.props;

    dispatch({
      type: 'customerProfile/addNote',
      payload: {
        text: values.note,
        owner: firstName,
        owner_id: _id,
        customerId: reId,
      },
    });
  };

  render() {
    const { isUnhide } = this.state;
    const { notes, listEmployeeActive } = this.props;

    const filter = (
      <>
        <NotesFilter listEmployeeActive={listEmployeeActive} />
        <div className={styles.btnForm}>
          <Button className={styles.btnClose} onClick={this.handleVisible}>
            Close
          </Button>
          <Button
            className={styles.btnApply}
            form="filter"
            htmlType="submit"
            key="submit"
            onClick={this.handleSubmit}
          >
            Apply
          </Button>
        </div>
      </>
    );

    return (
      <div className={styles.Notes}>
        <div className={styles.documentHeader}>
          <div className={styles.documentHeaderTitle}>
            <p>Notes</p>
          </div>
          <div className={styles.documentHeaderFunction}>
            {/* Filter */}
            <div>
              <Popover
                placement="bottomRight"
                content={filter}
                title={() => (
                  <div className={styles.popoverHeader}>
                    <p className={styles.headTitle}>Filters</p>
                    <p
                      className={styles.closeIcon}
                      style={{ cursor: 'pointer' }}
                      onClick={this.handleVisible}
                    >
                      <img src={cancelIcon} alt="close" />
                    </p>
                  </div>
                )}
                trigger="click"
                visible={isUnhide}
                onVisibleChange={this.handleVisible}
              >
                <div className={styles.filterButton} style={{ cursor: 'pointer' }}>
                  <FilterIcon />
                  <p className={styles.textButtonFilter}>Filter</p>
                </div>
              </Popover>
            </div>
            {/* Search */}
            <div className={styles.searchInp}>
              <Input placeholder="Search by Project name" prefix={<SearchOutlined />} />
            </div>
          </div>
        </div>
        <div className={styles.documentBody}>
          <Table
            columns={this.generateColumns()}
            dataSource={notes}
            pagination={false}
            scroll={{ y: 500 }}
          />
        </div>
        <div className={styles.notesFooter}>
          <Form layout="horizontal" onFinish={(values) => this.addNote(values)}>
            <Row gutter={48}>
              <Col span={20}>
                <Form.Item name="note">
                  <Input placeholder="Add a note for reference" />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item>
                  <Button htmlType="submit" className={styles.btnAdd}>
                    <PlusOutlined />
                    Add notes
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}

export default Notes;
