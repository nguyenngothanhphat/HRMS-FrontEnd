import { Button, Col, Collapse, Row, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import CommentIcon from '@/assets/homePage/comment.svg';
import DislikeIcon from '@/assets/homePage/dislike.svg';
import DislikedIcon from '@/assets/homePage/disliked.svg';
import ShowMoreIcon from '@/assets/homePage/downArrow.svg';
import LikeIcon from '@/assets/homePage/like.svg';
import LikedIcon from '@/assets/homePage/liked.svg';
import ShowLessIcon from '@/assets/homePage/upArrow.svg';
import CommentBox from '@/components/CommentBox';
import CommonModal from '@/components/CommonModal';
import PostLikedModalContent from '@/components/PostLikedModalContent';
import UserComment from '@/components/UserComment';
import { LIKE_ACTION, POST_OR_CMT } from '@/utils/homePage';
import styles from './index.less';

const { Panel } = Collapse;
const ACTION = {
  ADD: 'ADD',
  EDIT: 'EDIT',
};
const DEFAULT_COMMENT_LIMIT = 5;

const LikeComment = ({
  dispatch,
  user: {
    currentUser: { employee = {} } = {},
    permissions: { viewSettingHomePage = -1 } = {},
  } = {},
  homePage: { postComments = [], reactionList = [], reactionTotal = 0 } = {},
  post = {},
  loadingFetchComments = false,
  loadingAddComment = false,
  loadingEditComment = false,
  loadingRemoveComment = false,
  loadingFetchOnePost = false,
  loadingFetchReactList = false,
  activePostID = '',
  setActivePostID = () => {},
}) => {
  const [activeKey, setActiveKey] = useState('');
  const [commentValue, setCommentValue] = useState('');
  const [action, setAction] = useState(ACTION.ADD);
  const [handlingCommentId, setHandlingCommentId] = useState('');
  const [comments, setComments] = useState([]);
  const [limit, setLimit] = useState(DEFAULT_COMMENT_LIMIT);

  const [viewingPostOrCommentLiked, setViewingPostOrCommentLiked] = useState();
  const [isLikeOrDislike, setIsLikeOrDislike] = useState('');

  // API
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
      type: 'homePage/fetchPostCommentsEffect',
      payload: {
        post: postIdProp,
        limit: loadType ? newLimit : limit,
      },
    });
  };

  const refreshThisPost = () => {
    return dispatch({
      type: 'homePage/fetchPostByIdEffect',
      payload: {
        post: post?._id,
      },
    });
  };

  const refreshComments = () => {
    getPostCommentsEffect(post?._id);
  };

  const addNewCommentEffect = (content) => {
    return dispatch({
      type: 'homePage/addCommentEffect',
      payload: {
        post: post?._id,
        content,
      },
    }).then((res) => {
      if (res.statusCode === 200) {
        getPostCommentsEffect(post?._id);
      }
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
      postId: post?._id,
    });
  };

  const removeCommentEffect = (commentId) => {
    return dispatch({
      type: 'homePage/removeCommentEffect',
      params: {
        commentId,
      },
      postId: post?._id,
    });
  };

  const reactPostEffect = (postIdProp, type) => {
    return dispatch({
      type: 'homePage/reactPostEffect',
      payload: {
        post: postIdProp,
        type,
      },
    });
  };

  const getPostReactionListEffect = (type) => {
    return dispatch({
      type: 'homePage/fetchPostReactionListEffect',
      payload: {
        post: post?._id,
        type: type || isLikeOrDislike,
        page: 1,
        limit: Math.floor(reactionList.length / 5) * 5 + 5,
      },
    });
  };

  const getCommentReactionListEffect = (commentId, type) => {
    return dispatch({
      type: 'homePage/fetchPostReactionListEffect',
      payload: {
        comment: commentId,
        type: type || isLikeOrDislike,
        page: 1,
        limit: Math.floor(reactionList.length / 5) * 5 + 5,
      },
    });
  };

  useEffect(() => {
    const find = postComments.find((x) => x._id === post?._id);
    if (find) {
      setComments(find.data);
    }
  }, [JSON.stringify(postComments)]);

  // function
  // likes
  const onLikePost = async (type) => {
    setActivePostID(post?._id);
    const res = await reactPostEffect(post?._id, type);
    if (res.statusCode === 200) {
      refreshThisPost();
    }
  };

  // add comment
  const onComment = () => {
    if (!commentValue) return;
    setActivePostID(post?._id);
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
    setActivePostID(post?._id);
    setHandlingCommentId(id);
    setCommentValue(comments.find((comment) => comment.id === id)?.comment?.content);
  };

  // remove comment
  const onRemoveComment = (commentId) => {
    removeCommentEffect(commentId);
    setActivePostID(post?._id);
    setHandlingCommentId(commentId);
  };

  const onViewWhoLiked = (type) => {
    setIsLikeOrDislike(type);
    getPostReactionListEffect(type);
    setViewingPostOrCommentLiked(POST_OR_CMT.POST);
  };

  const onCloseLikedModal = () => {
    setViewingPostOrCommentLiked('');
    setIsLikeOrDislike('');
    dispatch({
      type: 'homePage/save',
      payload: {
        reactionList: [],
        reactionTotal: 0,
      },
    });
  };

  // render UI
  const renderCommentIcon = (isActive) => {
    return (
      <div
        className={styles.comments}
        onClick={async () => {
          setActivePostID(post?._id);
          setActiveKey(!isActive ? '1' : '');
          setLimit(DEFAULT_COMMENT_LIMIT);
          if (!isActive) {
            getPostCommentsEffect(post?._id);
          }
        }}
      >
        <div>
          <img src={CommentIcon} alt="" />
          <span>{post.totalComment} Comments</span>
        </div>
      </div>
    );
  };

  const renderLikeBtn = () => {
    const liked = post.react === LIKE_ACTION.LIKE;
    const disliked = post.react === LIKE_ACTION.DISLIKE;
    const likeCount = post.totalReact?.asObject?.[LIKE_ACTION.LIKE] || 0;
    const dislikeCount = post.totalReact?.asObject?.[LIKE_ACTION.DISLIKE] || 0;

    return (
      <Spin spinning={loadingFetchOnePost && activePostID === post._id} indicator={null}>
        <div className={styles.likes}>
          <div className={liked ? styles.likes__pressed : null}>
            <img
              src={liked ? LikedIcon : LikeIcon}
              alt=""
              onClick={() => onLikePost(LIKE_ACTION.LIKE)}
            />
            <span onClick={() => onViewWhoLiked(LIKE_ACTION.LIKE)}>
              {likeCount} {likeCount > 1 ? 'Likes' : 'Like'}
            </span>
          </div>
          <div className={disliked ? styles.likes__pressed : null}>
            <img
              src={disliked ? DislikedIcon : DislikeIcon}
              alt=""
              onClick={() => onLikePost(LIKE_ACTION.DISLIKE)}
            />
            <span onClick={() => onViewWhoLiked(LIKE_ACTION.DISLIKE)}>
              {dislikeCount} {dislikeCount > 1 ? 'Dislikes' : 'Dislike'}
            </span>
          </div>
        </div>
      </Spin>
    );
  };

  const renderShowMoreLessBtn = () => {
    const x = post.totalComment; // total comments of post
    const y = comments.length; // total showing comments on the frontend

    const showMore = x > y;
    const notShow =
      (x === y && x <= DEFAULT_COMMENT_LIMIT) ||
      (x === 0 && y === 0) ||
      (y === 0 && loadingFetchComments);

    if (notShow) return null;

    return (
      <div className={styles.loadMoreLess}>
        <Button onClick={() => getPostCommentsEffect(post?._id, showMore ? 'more' : 'less')}>
          {showMore ? 'Show more' : 'Show less'}
          <img src={showMore ? ShowMoreIcon : ShowLessIcon} alt="" />
        </Button>
      </div>
    );
  };

  return (
    <div className={styles.LikeComment}>
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
            spinning={(loadingFetchComments || loadingAddComment) && activePostID === post?._id}
          >
            <Row className={styles.commentContainer} gutter={[24, 16]}>
              {post.totalComment === 0 && (
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
                        post._id === activePostID &&
                        handlingCommentId === x._id
                      }
                      indicator={null}
                    >
                      <UserComment
                        item={x}
                        postId={post._id}
                        onEditComment={onEditComment}
                        onRemoveComment={onRemoveComment}
                        isMe={isMe}
                        isEdit={action === ACTION.EDIT && handlingCommentId === x._id}
                        onEditSubmit={onEdit}
                        onEditCancel={onEditCancel}
                        refreshComments={refreshComments}
                        setActivePostID={setActivePostID}
                        getCommentReactionListEffect={getCommentReactionListEffect}
                        setViewingPostOrCommentLiked={setViewingPostOrCommentLiked}
                        setIsLikeOrDislike={setIsLikeOrDislike}
                        hasPermission={viewSettingHomePage !== -1}
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

      <CommonModal
        visible={viewingPostOrCommentLiked}
        onClose={onCloseLikedModal}
        title={isLikeOrDislike === LIKE_ACTION.LIKE ? 'Likes' : 'Dislikes'}
        content={
          <PostLikedModalContent
            list={reactionList.map((x) => x.employee)}
            loading={loadingFetchReactList}
            total={reactionTotal}
            loadMore={getPostReactionListEffect}
          />
        }
        width={500}
        hasFooter={false}
        maskClosable
      />
    </div>
  );
};

export default connect(({ user, homePage, loading }) => ({
  user,
  homePage,
  loadingFetchComments: loading.effects['homePage/fetchPostCommentsEffect'],
  loadingAddComment: loading.effects['homePage/addCommentEffect'],
  loadingEditComment: loading.effects['homePage/editCommentEffect'],
  loadingRemoveComment: loading.effects['homePage/removeCommentEffect'],
  loadingFetchOnePost: loading.effects['homePage/fetchPostByIdEffect'],
  loadingReactPost: loading.effects['homePage/reactPostEffect'],
  loadingFetchReactList: loading.effects['homePage/fetchPostReactionListEffect'],
}))(LikeComment);
