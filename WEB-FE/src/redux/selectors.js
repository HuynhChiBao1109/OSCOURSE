// get user
export const getUserLoginSelector = (state) => state.userLoginSlice.userInfo;
export const getAllUserSelector = (state) => state.userSlice.users;
export const getAllUserSelectorGraphQL = (state) =>
  state.userSlice.userInfoGraphQL;
export const getUserSelector = (state) => state.userSlice.userInfo;

//COURSES
export const getCourseSelector = (state) => state.courseSlice.courses;
export const getAllCourseSelector = (state) => state.courseSlice.courseList;
export const getCourseByIdSelector = (state) => state.courseSlice.courseInfo;
export const getCommentByCourseSelector = (state) =>
  state.courseSlice.commentList;
export const getLoadingSelector = (state) => state.courseSlice.loading;
export const getDetailChapterInCourseSelector = (state) =>
  state.courseSlice.chapterDetail;
export const getAllChapterInCourseSelector = (state) =>
  state.courseSlice.chapterList;
export const getAllLessonInCourseSelector = (state) =>
  state.courseSlice.lessonList;
export const getOpenLessonInCourseSelector = (state) =>
  state.courseSlice.isOpenLesson;

//TRANSACTION
export const getAllTransactionByAdminSelector = (state) =>
  state.transactionSlice.transactions;
