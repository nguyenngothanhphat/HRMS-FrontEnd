import React, { PureComponent } from 'react';
import { Collapse, Row, Col } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { Events, animateScroll as scroll } from 'react-scroll';
import styles from './index.less';

const { Panel } = Collapse;
class ListQuestions extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      headerName: [],
      select: 'General FAQ',
    };
  }

  componentDidMount() {
    window.addEventListener('scroll', this.listenToScroll);
    window.scrollTo(0, 0);
    Events.scrollEvent.register('begin');
    Events.scrollEvent.register('end');
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.listenToScroll);
  }

  listenToScroll = () => {
    const position = window.pageYOffset;
    if (position < 50) {
      this.setState({ select: 'General FAQ' });
    } else if (position > 50 && position < 200) {
      this.setState({ select: 'Employee TimeOff' });
    } else if (position > 200 && position < 400) {
      this.setState({ select: 'Employee Directory' });
    } else if (position > 400 && position < 500) {
      this.setState({ select: 'Employee Onboarding' });
    } else if (position > 500 && position < 600) {
      this.setState({ select: 'Employee Offboarding' });
    }
  };

  onChange = (value) => {
    this.setState({
      headerName: value,
    });
  };

  scrollView = (value) => {
    const { category } = value;
    if (category === 'General FAQ') scroll.scrollMore(-1);
    else if (category === 'Employee TimeOff') {
      scroll.scrollMore(150);
    } else if (category === 'Employee Directory') {
      scroll.scrollMore(250);
    } else if (category === 'Employee Onboarding') {
      scroll.scrollMore(350);
    } else if (category === 'Employee Offboarding') {
      scroll.scrollMore(600);
    }
  };

  _renderItemMenu = (item) => {
    const { select } = this.state;
    const classNameItemMenu = select === item.category ? styles.itemMenuAcive : styles.itemMenu;
    return (
      <div onClick={() => this.scrollView(item)} className={classNameItemMenu} key={item._id}>
        {item.category}
      </div>
    );
  };

  renderItem = (render, idQuestion) => {
    const { questionAndAnswer = [] } = render;
    const { headerName = [] } = this.state;
    return (
      <div className={styles.timeoffRuleFrom}>
        <div className={styles.titleText}>{render.category}</div>
        <div className={styles.childrenFrom}>
          {questionAndAnswer.map((item) => {
            const { question, answer, _id } = item;
            return (
              <div key={item} className={styles.collapse} id={_id}>
                <Collapse
                  defaultActiveKey={[question]}
                  expandIconPosition="right"
                  ghost
                  expandIcon={(props) => {
                    return props.isActive ? (
                      <div className={styles.minusBoder}>
                        <div className={styles.center}>
                          <MinusOutlined />
                        </div>
                      </div>
                    ) : (
                      <div className={styles.plusBoder}>
                        <div className={styles.center}>
                          <PlusOutlined />
                        </div>
                      </div>
                    );
                  }}
                  onChange={(value) => this.onChange(value)}
                >
                  <Panel
                    header={
                      <div
                        className={
                          idQuestion === _id || headerName.indexOf(_id) > -1
                            ? styles.activeHeader
                            : styles.header
                        }
                      >
                        {question}
                      </div>
                    }
                    key={_id}
                  >
                    <div className={styles.content}>{answer}</div>
                  </Panel>
                </Collapse>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  render() {
    const { list = [], idQuestion = {} } = this.props;
    const { id = '' } = idQuestion;
    const listQuestion = [];

    list.forEach(({ questionAndAnswer, category }) => {
      const listQAs = questionAndAnswer.map((qa) => ({ ...qa, category }));
      listQuestion.push(...listQAs);
      return listQuestion;
    });

    return (
      <div className={styles.container}>
        <Row>
          <Col span={6}>
            <div className={styles.leftMenu}>{list.map((item) => this._renderItemMenu(item))}</div>
          </Col>
          <Col span={18} className={styles.contentQuestion}>
            {list.map((render) => this.renderItem(render, id))}
          </Col>
        </Row>
      </div>
    );
  }
}

export default ListQuestions;
