import { Button, Col, Collapse, Row, Spin } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import CommentIcon from '@/assets/homePage/comment.svg';
import ShowMoreIcon from '@/assets/homePage/downArrow.svg';
import LikeIcon from '@/assets/homePage/like.svg';
import LikedIcon from '@/assets/homePage/liked.svg';
import PlaceholderImage from '@/assets/homePage/previewImage.png';
import ShowLessIcon from '@/assets/homePage/upArrow.svg';
import CommentBox from '@/components/CommentBox';
import CommonModal from '@/components/CommonModal';
import PostLikedModalContent from '@/components/PostLikedModalContent';
import UserComment from '@/components/UserComment';
import UserProfilePopover from '@/components/UserProfilePopover';
import { CELEBRATE_TYPE, LIKE_ACTION, POST_OR_CMT, roundNumber, TAB_IDS } from '@/utils/homePage';
import { getCompanyName, singularify } from '@/utils/utils';
import styles from './index.less';

const DEFAULT_COMMENT_LIMIT = 3;
const { Panel } = Collapse;

const ACTION = {
  ADD: 'ADD',
  EDIT: 'EDIT',
};

const CelebratingDetailModalContent = (props) => {
  const {
    dispatch,
    item = {},
    currentUser: { employee = {} } = {},
    permissions: { viewSettingHomePage = -1 } = {},
    getPostReactionListEffect = () => {},
    loadingFetchReactList = false,
    homePage: { postComments = [], reactionList = [], reactionTotal = 0 } = {},
    loadingFetchComments = false,
    loadingAddComment = false,
    loadingEditComment = false,
    loadingRemoveComment = false,
    loadingFetchOnePost = false,
    onLikePost = () => {},
    loadingReactPost = false,
    isReactPostOrCmt = false,
    setIsReactPostOrCmt = () => {},
    activePostID = '',
    setActivePostID = () => {},
  } = props;

  const [activeKey, setActiveKey] = useState('1');
  const [action, setAction] = useState(ACTION.ADD);
  const [handlingCommentId, setHandlingCommentId] = useState('');
  const [limit, setLimit] = useState(DEFAULT_COMMENT_LIMIT);
  const [viewingPostOrCommentLiked, setViewingPostOrCommentLiked] = useState({
    id: '',
    type: '',
  });
  const [commentValue, setCommentValue] = useState('');
  const [comments, setComments] = useState([]);
  const [isLikeOrDislike, setIsLikeOrDislike] = useState('');

  // functions
  const onViewProfileClick = (userId) => {
    if (userId) {
      history.push(`/directory/employee-profile/${userId}/general-info`);
    }
  };

  const isTheSameDay = (date1, date2) => {
    return moment(date1).format('MM/DD') === moment(date2).format('MM/DD');
  };

  const getPostCommentsEffect = (postIdProp, loadType) => {
    let newLimit = limit;
    if (loadType === 'more') {
      newLimit =
        Math.floor(comments.length / DEFAULT_COMMENT_LIMIT) * DEFAULT_COMMENT_LIMIT +
        DEFAULT_COMMENT_LIMIT;
    }
    if (loadType === 'less') {
      newLimit = DEFAULT_COMMENT_LIMIT;
    }
    setLimit(newLimit);
    return dispatch({
      type: 'homePage/fetchAnniversaryCommentsEffect',
      payload: {
        post: postIdProp,
        limit: loadType ? newLimit : limit,
      },
      varType: TAB_IDS.ANNIVERSARY,
    });
  };

  const editCommentEffect = (commentId, content) => {
    return dispatch({
      type: 'homePage/editCommentEffect',
      payload: {
        content,
      },
      params: {
        commentId,
      },
      postId: item?._id,
    });
  };

  const removeCommentEffect = (commentId) => {
    return dispatch({
      type: 'homePage/removeCommentEffect',
      params: {
        commentId,
      },
      postId: item?._id,
      varName: TAB_IDS.ANNIVERSARY,
    });
  };

  const getCommentReactionListEffect = (commentId, type = LIKE_ACTION.LIKE) => {
    return dispatch({
      type: 'homePage/fetchPostReactionListEffect',
      payload: {
        comment: commentId,
        type,
        page: 1,
        limit: Math.floor(reactionList.length / 5) * 5 + 5,
      },
    });
  };

  const refreshComments = () => {
    getPostCommentsEffect(item?._id);
  };

  const addNewCommentEffect = (content) => {
    return dispatch({
      type: 'homePage/addCommentEffect',
      payload: {
        post: item?._id,
        content,
      },
      varName: TAB_IDS.ANNIVERSARY,
    }).then((res) => {
      if (res.statusCode === 200) {
        getPostCommentsEffect(item?._id);
      }
    });
  };

  const onViewWhoLiked = (postId) => {
    setIsLikeOrDislike(LIKE_ACTION.LIKE);
    getPostReactionListEffect(postId, LIKE_ACTION.LIKE);
    setViewingPostOrCommentLiked({ id: postId, type: POST_OR_CMT.POST });
  };

  useEffect(() => {
    const find = postComments.find((x) => x._id === item?._id);
    if (find) {
      setComments(find.data);
    }
  }, [JSON.stringify(postComments)]);

  useEffect(() => {
    setLimit(DEFAULT_COMMENT_LIMIT);
    if (activeKey === '1') {
      setActivePostID(item?._id);
      getPostCommentsEffect(item?._id);
    }
  }, [activeKey]);

  // render UI
  const renderEmployeeName = (data = {}) => {
    return (
      <UserProfilePopover
        placement="bottom"
        data={{
          ...data,
          ...data.generalInfoInfo,
        }}
      >
        <span
          className={styles.employeeName}
          onClick={() => onViewProfileClick(data?.generalInfoInfo?.userId)}
        >
          {data?.generalInfoInfo.legalName}
        </span>
      </UserProfilePopover>
    );
  };

  const renderCardContent = (card = {}) => {
    const { createdBy = {}, eventType = '', eventDate = '' } = card;
    const employeeName = renderEmployeeName(createdBy);

    if (eventType === CELEBRATE_TYPE.BIRTHDAY) {
      const isToday = isTheSameDay(moment(), moment(eventDate));
      const birthday = moment.utc(eventDate).locale('en').format('MMM Do');
      if (isToday)
        return (
          <span>
            Happy Birthday {employeeName} ({birthday}) !!!
          </span>
        );
      return (
        <span>
          Upcoming birthday: {employeeName} ({birthday})
        </span>
      );
    }
    if (eventType === CELEBRATE_TYPE.ANNIVERSARY) {
      const yearCount = moment
        .utc()
        .diff(moment.utc(createdBy?.joinDate).format('YYYY-MM-DD'), 'years', true);
      return (
        <span>
          Congratulations {employeeName} on completing {roundNumber(yearCount)}{' '}
          {singularify('year', yearCount)} with {getCompanyName()} !!!
        </span>
      );
    }
    if (eventType === CELEBRATE_TYPE.NEWJOINEE) {
      return (
        <span>
          {employeeName} ({moment.utc(eventDate).locale('en').format('MMM Do, YYYY')}) - Welcome to
          the team Newbie !!!
        </span>
      );
    }
    return '';
  };

  const onComment = () => {
    if (!commentValue) return;
    setActivePostID(item._id);
    addNewCommentEffect(commentValue);
    setCommentValue('');
  };

  // edit comment
  const onEdit = async (value) => {
    if (!value) return;
    const temp = comments.map((x) => {
      if (x._id === handlingCommentId) {
        return {
          ...x,
          content: value,
        };
      }
      return x;
    });
    setComments(temp);
    setAction(ACTION.ADD);
    setCommentValue('');
    await editCommentEffect(handlingCommentId, value);
    setHandlingCommentId('');
  };

  const onEditCancel = () => {
    setAction(ACTION.ADD);
    setHandlingCommentId('');
    setCommentValue('');
  };

  const onEditComment = (id) => {
    setAction(ACTION.EDIT);
    setHandlingCommentId(id);
    setCommentValue(comments.find((comment) => comment.id === id)?.comment?.content);
  };

  // remove comment
  const onRemoveComment = (commentId) => {
    removeCommentEffect(commentId);
    setActivePostID(item?._id);
    setHandlingCommentId(commentId);
  };

  const onCloseLikedModal = () => {
    setViewingPostOrCommentLiked({
      id: '',
      type: '',
    });
    setIsLikeOrDislike('');
    dispatch({
      type: 'homePage/save',
      payload: {
        reactionList: [],
        reactionTotal: 0,
      },
    });
  };

  const renderCommentIcon = (isActive) => {
    return (
      <div
        className={styles.comments}
        onClick={async () => {
          setActiveKey(!isActive ? '1' : '');
        }}
      >
        <div>
          <img src={CommentIcon} alt="" />
          <span>
            {item.totalComment || 0} {singularify('Comment', item.totalComment)}
          </span>
        </div>
      </div>
    );
  };

  const renderLikeBtn = () => {
    const liked = item.react === LIKE_ACTION.LIKE;
    const likeCount = item.totalReact?.asObject?.[LIKE_ACTION.LIKE] || 0;

    return (
      <Spin
        spinning={
          (loadingFetchOnePost || (loadingReactPost && isReactPostOrCmt === POST_OR_CMT.POST)) &&
          activePostID === item._id
        }
        indicator={null}
      >
        <div className={styles.likes}>
          <div className={liked ? styles.likes__pressed : null}>
            <img src={liked ? LikedIcon : LikeIcon} alt="" onClick={() => onLikePost(item?._id)} />
            <span onClick={() => onViewWhoLiked(item?._id)}>
              {likeCount} {singularify('Like', likeCount)}
            </span>
          </div>
        </div>
      </Spin>
    );
  };

  const renderShowMoreLessBtn = () => {
    const x = item.totalComment; // total comments of post
    const y = comments.length; // total showing comments on the frontend

    const showMore = x > y;
    const notShow =
      (x === y && x <= DEFAULT_COMMENT_LIMIT) ||
      (x === 0 && y === 0) ||
      (y === 0 && loadingFetchComments);

    if (notShow) return null;

    return (
      <div className={styles.loadMoreLess}>
        <Button onClick={() => getPostCommentsEffect(item?._id, showMore ? 'more' : 'less')}>
          {showMore ? 'Show more' : 'Show less'}
          <img src={showMore ? ShowMoreIcon : ShowLessIcon} alt="" />
        </Button>
      </div>
    );
  };

  const renderCard = (card) => {
    const { createdBy = {} } = card;
    return (
      <div className={styles.cardContainer}>
        <div className={styles.above}>
          <div className={styles.image}>
            <img
              src={createdBy.generalInfoInfo?.avatar}
              onError={(e) => {
                e.target.src = PlaceholderImage;
              }}
              alt=""
            />
          </div>
          <div className={styles.content}>
            <p className={styles.caption}>{renderCardContent(card)}</p>
          </div>
        </div>
        <div className={styles.below}>
          <Collapse
            activeKey={activeKey}
            expandIconPosition="right"
            expandIcon={({ isActive }) => renderCommentIcon(isActive)}
            ghost
            destroyInactivePanel
            bordered={false}
          >
            <Panel header={renderLikeBtn()} key="1">
              <CommentBox
                onChange={action === ACTION.ADD ? setCommentValue : () => {}}
                value={action === ACTION.ADD ? commentValue : null}
                onSubmit={onComment}
                disabled={action === ACTION.EDIT}
              />
              <Spin
                spinning={
                  (loadingFetchComments ||
                    loadingAddComment ||
                    (loadingReactPost && isReactPostOrCmt === POST_OR_CMT.COMMENT)) &&
                  activePostID === item?._id
                }
              >
                <Row className={styles.commentContainer} gutter={[24, 16]}>
                  {item.totalComment === 0 && (
                    <Col span={24}>
                      <div className={styles.noComment}>
                        <span>No comment</span>
                      </div>
                    </Col>
                  )}
                  {comments.map((x) => {
                    const isMe = employee?._id === x.employee?._id;
                    return (
                      <Col
                        span={24}
                        key={x._id}
                        onClick={(e) => {
                          if (e.detail === 2 && isMe) {
                            onEditComment(x._id);
                          }
                        }}
                      >
                        <Spin
                          spinning={
                            (loadingEditComment || loadingRemoveComment) &&
                            item._id === activePostID &&
                            handlingCommentId === x._id
                          }
                          indicator={null}
                        >
                          <UserComment
                            item={x}
                            postId={item._id}
                            onEditComment={onEditComment}
                            onRemoveComment={onRemoveComment}
                            isMe={isMe}
                            isEdit={action === ACTION.EDIT && handlingCommentId === x._id}
                            onEditSubmit={onEdit}
                            setActivePostID={setActivePostID}
                            onEditCancel={onEditCancel}
                            refreshComments={refreshComments}
                            getCommentReactionListEffect={getCommentReactionListEffect}
                            setViewingPostOrCommentLiked={setViewingPostOrCommentLiked}
                            hasPermission={viewSettingHomePage !== -1}
                            setIsReactPostOrCmt={setIsReactPostOrCmt}
                            varName={TAB_IDS.ANNIVERSARY}
                            setIsLikeOrDislike={setIsLikeOrDislike}
                          />
                        </Spin>
                      </Col>
                    );
                  })}
                  {renderShowMoreLessBtn()}
                </Row>
              </Spin>
            </Panel>
          </Collapse>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.CelebratingDetailModalContent}>
      {renderCard(item)}
      <CommonModal
        visible={viewingPostOrCommentLiked.id}
        onClose={onCloseLikedModal}
        title={isLikeOrDislike === LIKE_ACTION.LIKE ? 'Likes' : 'Dislikes'}
        content={
          <PostLikedModalContent
            list={reactionList.map((x) => x.employee)}
            loading={loadingFetchReactList}
            total={reactionTotal}
            loadMore={
              viewingPostOrCommentLiked.type === POST_OR_CMT.POST
                ? () => getPostReactionListEffect(item?._id, isLikeOrDislike)
                : () => getCommentReactionListEffect(viewingPostOrCommentLiked.id, isLikeOrDislike)
            }
          />
        }
        width={500}
        hasFooter={false}
        maskClosable
      />
    </div>
  );
};
export default connect(({ homePage, user: { currentUser, permissions } = {}, loading }) => ({
  currentUser,
  permissions,
  homePage,
  loadingRefresh: loading.effects['homePage/fetchCelebrationList'],
  loadingFetchReactList: loading.effects['homePage/fetchPostReactionListEffect'],
  loadingFetchComments: loading.effects['homePage/fetchAnniversaryCommentsEffect'],
  loadingAddComment: loading.effects['homePage/addCommentEffect'],
  loadingEditComment: loading.effects['homePage/editCommentEffect'],
  loadingRemoveComment: loading.effects['homePage/removeCommentEffect'],
  loadingFetchOnePost: loading.effects['homePage/fetchAnniversaryByIdEffect'],
  loadingReactPost: loading.effects['homePage/reactAnniversaryEffect'],
}))(CelebratingDetailModalContent);
