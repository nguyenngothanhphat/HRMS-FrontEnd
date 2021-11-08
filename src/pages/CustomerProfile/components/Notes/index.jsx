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
    this.refForm = React.createRef();
  }

  componentDidMount() {
    const { dispatch, customerId } = this.props;
    dispatch({
      type: 'customerProfile/fetchNotes',
      payload: {
        id: customerId,
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

  renderNotes = () => {
    const { notes } = this.props;

    return (
      <div className={styles.documentBody}>
        {notes.map((note) => {
          const { owner = '', text = '' } = note;
          const time = moment(note.created_at).locale('en').format('DD MMM YY');
          return (
            <div className={styles.note}>
              <p>{text}</p>
              <div className={styles.smallText}>
                <span className={styles.author}>{owner}</span>
                <span className={styles.time}>{time}</span>
              </div>
            </div>
          );
        })}
      </div>
    );
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
    }).then(() => {
      this.refForm.current.resetFields();
    });
  };

  render() {
    const { isUnhide } = this.state;
    const { listEmployeeActive } = this.props;

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
            <span>Notes</span>
          </div>
          <div className={styles.documentHeaderFunction}>
            {/* Filter */}
            <div>
              <Popover
                placement="bottomRight"
                content={filter}
                title={() => (
                  <div className={styles.popoverHeader}>
                    <span className={styles.headTitle}>Filters</span>
                    <span
                      className={styles.closeIcon}
                      style={{ cursor: 'pointer' }}
                      onClick={this.handleVisible}
                    >
                      <img src={cancelIcon} alt="close" />
                    </span>
                  </div>
                )}
                trigger="click"
                visible={isUnhide}
                onVisibleChange={this.handleVisible}
                overlayClassName={styles.FilterPopover}
              >
                <div className={styles.filterButton} style={{ cursor: 'pointer' }}>
                  <FilterIcon />
                  <span className={styles.textButtonFilter}>Filter</span>
                </div>
              </Popover>
            </div>
            {/* Search */}
            <div className={styles.searchInp}>
              <Input placeholder="Search by Key Words" prefix={<SearchOutlined />} />
            </div>
          </div>
        </div>

        {this.renderNotes()}

        <div className={styles.notesFooter}>
          <Form ref={this.refForm} layout="horizontal" onFinish={(values) => this.addNote(values)}>
            <Row gutter={48} align="middle">
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
