import React, { Component } from 'react';
import { Tabs } from 'antd';
import { history, connect } from 'umi';
import { debounce } from 'lodash';
import { PageContainer } from '@/layouts/layout/src';
import AllTicket from './components/AllTickets';
import styles from './index.less';

@connect(
    ({
        ticketManagement: {
        listOffAllTicket = [],
        totalList = [],
      } = {},
      user: {
        currentUser: {
          location: { _id: locationID = '' } = {},
          company: { _id: companyID } = {},
        } = {},
      } = {},
      locationSelection: { listLocationsByCompany = [] },
    }) => ({
      listOffAllTicket,
      totalList,
      locationID,
      companyID,
      listLocationsByCompany,
    }),
)

class ManagerTicket extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataListAllTickets:[],
            loadingSearch:false,
        };
        this.setDebounce = debounce((query) => {
            this.setState({
                dataListAllTickets: query,
                loadingSearch: false,
            });
        }, 1000);
    }
    
    componentDidMount() {
        const { tabName = '' } = this.props;
        if (!tabName) {
            history.replace(`/ticket-management/alltickets`);
        }else {
            const { dispatch, listOffAllTicket, locationID } = this.props;
            if (!dispatch) {
              return;
            }
            dispatch({
              type: 'offboarding/fetchListAllTicket',
              payload: {
                location: [locationID],
              },
            });
            if (listOffAllTicket.length > 0) this.updateData(listOffAllTicket);
        }
    }
    componentDidUpdate(prevProps){
        const { listOffAllTicket = [] } = this.props;
        if (JSON.stringify(listOffAllTicket) !== JSON.stringify(prevProps.listOffAllTicket)) {
          this.updateData(listOffAllTicket);
        }
    }

    updateData = (listOffAllTicket) => {
        this.setState({
          dataListAllTickets: listOffAllTicket,
        });
      };
    
    onSearch = (value) => {
        
    };

    render() {
        const { TabPane } = Tabs;

        return (
            <div className={styles.TicketManagement}>
                <PageContainer>
                    <Tabs
                        activeKey={'allticket'}
                        onChange={(key) => {
                            history.push(`/ticket-management/${key}`);
                        }}
                    >
                        <TabPane tab="OverView" key="overview">
                            {/* <OverView /> */}
                        </TabPane>
                        <TabPane tab="AllTickets" key="allticket">
                            <AllTicket />
                        </TabPane>
                    </Tabs>
                </PageContainer>
            </div>
        )
    }
}

export default ManagerTicket
