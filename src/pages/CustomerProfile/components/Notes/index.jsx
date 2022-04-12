import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Popover, Row, Skeleton } from 'antd';
import { debounce } from 'lodash';
import moment from 'moment';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import cancelIcon from '../../../../assets/cancelIcon.svg';
import { FilterIcon } from './components/FilterIcon';
import NotesFilter from './components/NotesFilter';
import styles from './index.less';

@connect(
  ({
    loading,
    location: { companyLocationList = [] } = {},
    user: { companiesOfUser = [], currentUser: { _id = '', firstName = '' } = {} } = {},
    customerProfile: { info: { customerId = '' } = {}, notes = [] } = {},
    customerManagement: { employeeList = [] } = {},
  }) => ({
    loadingNotes: loading.effects['customerProfile/fetchNotes'],
    loadingFilterNotes: loading.effects['customerProfile/filterNotes'],
    notes,
    customerId,
    _id,
    firstName,
    companyLocationList,
    companiesOfUser,
    employeeList,
  }),
)
class Notes extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      isUnhide: false,
    };
    this.delaySearch = debounce((value) => {
      this.handleSearch(value);
    }, 1000);
  }

  componentDidMount() {
    this.fetchNotes();
  }

  componentDidUpdate = (prevProps) => {
    const { customerId } = this.props;
    if (prevProps.customerId !== customerId) {
      this.fetchNotes();
    }
  };

  fetchNotes = () => {
    const { dispatch, customerId } = this.props;
    dispatch({
      type: 'customerProfile/fetchNotes',
      payload: {
        id: customerId,
      },
    });
  };

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
      this.formRef?.current?.resetFields();
    });
  };

  handleSearch = (value) => {
    const { dispatch, reId } = this.props;
    dispatch({
      type: 'customerProfile/searchNotes',
      payload: {
        id: reId,
        searchKey: value,
      },
    });
  };

  onFilter = (values) => {
    const { byAuthor, fromDate, toDate } = values;
    const { dispatch, info: { customerId = '' } = {} } = this.props;
    dispatch({
      type: 'customerProfile/filterNotes',
      payload: {
        customerId,
        author: byAuthor,
        fromDate: fromDate || '',
        toDate: toDate || '',
      },
    });
  };

  render() {
    const { isUnhide } = this.state;
    const { employeeList = [], loadingNotes = false, loadingFilterNotes = false } = this.props;

    const filter = (
      <>
        <NotesFilter employeeList={employeeList} onFilter={this.onFilter} />
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
            loading={loadingFilterNotes}
          >
            Apply
          </Button>
        </div>
      </>
    );

    if (loadingNotes) return <Skeleton />;
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
              <Input
                placeholder="Search by Key Words"
                prefix={<SearchOutlined />}
                onChange={(e) => this.delaySearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {this.renderNotes()}

        <div className={styles.notesFooter}>
          <Form ref={this.formRef} layout="horizontal" onFinish={(values) => this.addNote(values)}>
            <Row gutter={[24, 0]} align="middle" justify="space-between">
              <Col lg={18} xl={20}>
                <Form.Item name="note">
                  <Input placeholder="Add a note for reference" />
                </Form.Item>
              </Col>
              <Col lg={6} xl={4}>
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
