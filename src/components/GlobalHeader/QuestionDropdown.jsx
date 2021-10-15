import { Menu } from 'antd';
import React from 'react';
import { connect, history } from 'umi';
import FAQIcon from '@/assets/dashboard/faq.svg';
import QuestionIcon from '@/assets/dashboard/question.svg';
import QuickLinkIcon from '@/assets/dashboard/quickLink.svg';
import RaiseTicketIcon from '@/assets/dashboard/raiseTicket.svg';
import CommonModal from '@/components/CommonModal';
import QuickLinks from '@/components/QuickLinks';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import RaiseTicketModal from '../RaiseTicketModal';

@connect(() => ({}))
class QuestionDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      QUICK_LINKS: 'QUICK_LINKS',
      FAQ: 'FAQ',
      RAISE_TICKET: 'RAISE_TICKET',
      quickLinkModalVisible: false,
      raiseTicketModalVisible: false,
    };
  }

  onToggleQuickLinkModal = () => {
    this.setState(({ quickLinkModalVisible }) => ({
      quickLinkModalVisible: !quickLinkModalVisible,
    }));
  };

  onToggleRaiseTicketModal = () => {
    this.setState(({ raiseTicketModalVisible }) => ({
      raiseTicketModalVisible: !raiseTicketModalVisible,
    }));
  };

  onMenuClick = async (event) => {
    const { key } = event;
    const { QUICK_LINKS, FAQ, RAISE_TICKET } = this.state;
    if (key === QUICK_LINKS) {
      this.onToggleQuickLinkModal();
    }
    if (key === FAQ) {
      history.push('/faqpage');
    }
    if (key === RAISE_TICKET) {
      this.onToggleRaiseTicketModal();
    }
  };

  render() {
    const { QUICK_LINKS, FAQ, RAISE_TICKET, quickLinkModalVisible, raiseTicketModalVisible } =
      this.state;
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        <Menu.Item key={QUICK_LINKS} className={styles.menuItemLink}>
          <div className={styles.menuItemLink__withIcon}>
            <img src={QuickLinkIcon} alt="" />
            <span>Quick Links</span>
          </div>
        </Menu.Item>
        {/* <Menu.Divider className={styles.secondDivider} /> */}
        <Menu.Item key={RAISE_TICKET} className={styles.menuItemLink}>
          <div className={styles.menuItemLink__withIcon}>
            <img src={RaiseTicketIcon} alt="" />
            <span>Raise Ticket</span>
          </div>
        </Menu.Item>
        {/* <Menu.Divider className={styles.secondDivider} /> */}
        <Menu.Item key={FAQ} className={styles.menuItemLink}>
          <div className={styles.menuItemLink__withIcon}>
            <img src={FAQIcon} alt="" />
            <span>FAQ</span>
          </div>
        </Menu.Item>
        {/* <Menu.Divider className={styles.secondDivider} /> */}
      </Menu>
    );
    return (
      <>
        <HeaderDropdown overlay={menuHeaderDropdown}>
          <div className={`${styles.action} ${styles.notify}`}>
            <img src={QuestionIcon} alt="" />
          </div>
        </HeaderDropdown>
        <CommonModal
          visible={quickLinkModalVisible}
          title="Quick Links"
          onClose={this.onToggleQuickLinkModal}
          hasFooter={false}
          content={<QuickLinks />}
        />
        <RaiseTicketModal
          visible={raiseTicketModalVisible}
          title="Raise Ticket"
          onClose={this.onToggleRaiseTicketModal}
        />
      </>
    );
  }
}

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(QuestionDropdown);
