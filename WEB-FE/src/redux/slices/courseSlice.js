import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addChapterInCourse,
  addLessonInCourse,
  addQuizLesson,
  addVideoInLesson,
  createCommentInCourse,
  createCourseMutation,
  deleteChapterById,
  deleteCommentInCourse,
  deleteCourseById,
  deleteLessonById,
  fetchCourse,
  getCourseById,
  getDetailChapterInCourse,
  getListChildren,
  getListCommentByCourse,
  putChapterInCourse,
  updateLessonInCourse,
  updateQuizInLessonCourse,
} from "../../graphQL/courseApi";
import { useDispatch } from "react-redux";

export const fetchCourseGraphQL = createAsyncThunk(
  "courses/fetchCourseGraphQL",
  async (
    { currentPage, pageSize, searchName, category },
    { rejectWithValue }
  ) => {
    try {
      const data = await fetchCourse({
        currentPage,
        pageSize,
        searchName,
        category,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCourseIDGraphQL = createAsyncThunk(
  "courses/fetchCourseIDGraphQL",
  async (courseId, { rejectWithValue, getState }) => {
    try {
      console.log("Fetching course details for courseId:", courseId);
      const data = await getCourseById(courseId);
      console.log("Fetched course data:", data);
      console.log("Fetched course data chapter:", data.chapter);
      return data;
    } catch (error) {
      console.error("Error fetching course details:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchListChilByID = createAsyncThunk(
  "courses/fetchListChilByID",
  async (parentID, { rejectWithValue, getState }) => {
    try {
      console.log("parentID for courseId:", parentID);
      const data = await getListChildren(parentID);
      console.log("Fetched course data:", data);
      return data;
    } catch (error) {
      console.error("Error fetching course details:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const createCourseGraphQL = createAsyncThunk(
  "course/createCourseGraphQL",
  async (courseData, { rejectWithValue }) => {
    console.log("reducer: ", courseData);
    try {
      return await createCourseMutation(courseData);
    } catch (error) {
      console.log("Error creating course:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchGetListComment = createAsyncThunk(
  "courses/commentByCourseGraphQL",
  async (courseId, { rejectWithValue }) => {
    try {
      const data = await getListCommentByCourse(courseId);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const postCommentInCourse = createAsyncThunk(
  "courses/createCommentInCourseGraphQL",
  async (commentData, { rejectWithValue }) => {
    try {
      const data = await createCommentInCourse(commentData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeCommentInCourse = createAsyncThunk(
  "courses/deleteCommentInCourseGraphQL",
  async (commentId, { rejectWithValue }) => {
    try {
      const data = await deleteCommentInCourse(commentId);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getDetailChapterCourse = createAsyncThunk(
  "courses/detailChapterInCourseGraphQL",
  async (chapterId, { rejectWithValue }) => {
    console.log("redux", chapterId);
    try {
      const data = await getDetailChapterInCourse(chapterId);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addChapterCourse = createAsyncThunk(
  "courses/addChapterCourse",
  async (chapterData, { rejectWithValue, dispatch }) => {
    try {
      const data = await addChapterInCourse(chapterData);
      dispatch(fetchCourseIDGraphQL(data.course_id)); // Note: Không chạy vào đây được

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateChapterCourse = createAsyncThunk(
  "courses/updateChapterInCourseGraphQL",
  async (chapterData, { rejectWithValue }) => {
    try {
      const data = await putChapterInCourse(chapterData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addLessonCourse = createAsyncThunk(
  "courses/addLessonInCourseGraphQL",
  async (lessonData, { rejectWithValue }) => {
    try {
      const data = await addLessonInCourse(lessonData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addVideo = createAsyncThunk(
  "courses/addVideo",
  async (lessonData, { dispatch, rejectWithValue }) => {
    try {
      const data = await addVideoInLesson(lessonData);
      return data;
    } catch (error) {
      console.log(error);
      throw error.message;
    }
  }
);

export const removeCourseById = createAsyncThunk(
  "courses/deleteCourseByIdGraphQL",
  async (courseId, { rejectWithValue }) => {
    try {
      const data = await deleteCourseById(courseId);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const putCourse = createAsyncThunk(
  "courses/updateCourseGraphQL",
  async (courseData, { rejectWithValue }) => {
    try {
      await updateCourse(courseData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addQuizLessonInChapter = createAsyncThunk(
  "courses/addQuizGraphQL",
  async (quizData, { rejectWithValue }) => {
    try {
      const data = await addQuizLesson(quizData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteLessonInChapter = createAsyncThunk(
  "courses/deleteLessonGraphQL",
  async (lessonId, { rejectWithValue }) => {
    try {
      const data = await deleteLessonById(lessonId);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteChapterInCourse = createAsyncThunk(
  "courses/deleteChapterGraphQL",
  async (chapterId, { rejectWithValue }) => {
    try {
      const data = await deleteChapterById(chapterId);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const putQuizInLesson = createAsyncThunk(
  "courses/updateQuiz",
  async (quizData, { rejectWithValue }) => {
    try {
      const data = await updateQuizInLessonCourse(quizData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const putLessonCourse = createAsyncThunk(
  "courses/updateLesson",
  async (lessonData, { rejectWithValue }) => {
    try {
      const data = await updateLessonInCourse(lessonData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const courseSlice = createSlice({
  name: "courseSlice",
  initialState: {
    loading: false,
    error: null,
    courses: null,
    courseInfo: null,
    courseList: null,
    commentList: null,
    chapterDetail: null,
    chapterList: null,
    lessonList: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.userInfo = action.payload;
      console.log("setUser", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourseGraphQL.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCourseGraphQL.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
        state.courseList = action.payload.course;
      })
      .addCase(fetchCourseGraphQL.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCourseGraphQL.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCourseGraphQL.fulfilled, (state, action) => {
        state.loading = false;
        // state.courseList = action.payload;
      })
      .addCase(createCourseGraphQL.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchCourseIDGraphQL.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCourseIDGraphQL.fulfilled, (state, action) => {
        state.loading = false;
        state.courseInfo = action.payload;
        state.chapterList = action.payload.chapter;
      })
      .addCase(fetchCourseIDGraphQL.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchGetListComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGetListComment.fulfilled, (state, action) => {
        state.loading = false;
        state.commentList = action.payload;
      })
      .addCase(fetchGetListComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(postCommentInCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(postCommentInCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.commentList && state.commentList.unshift(action.payload);
      })
      .addCase(postCommentInCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeCommentInCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeCommentInCourse.fulfilled, (state, action) => {
        state.loading = false;
        const updatedCommentList = state.commentList.filter(
          (comment) => comment.id !== action.payload.id
        );
        state.commentList = updatedCommentList;
      })
      .addCase(removeCommentInCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeCourseById.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeCourseById.fulfilled, (state, action) => {
        state.loading = false;
        const courseIdToDelete = action.payload.id;
        const updatedCourseList = state.courseList.filter(
          (course) => course.id !== courseIdToDelete
        );
        state.courseList = updatedCourseList;
      })
      .addCase(removeCourseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getDetailChapterCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDetailChapterCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.chapterDetail = action.payload;
        state.lessonList = action.payload.lessons;
      })
      .addCase(getDetailChapterCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addChapterCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(addChapterCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.chapterList = [...state.chapterList, action.payload];
        console.log(
          "[...state.chapterList, action.payload]: " +
          [...state.chapterList, action.payload]
        );
      })

      .addCase(addChapterCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateChapterCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateChapterCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.chapterList.push(action.payload);
      })
      .addCase(updateChapterCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addLessonCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(addLessonCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.lessonList.push(action.payload);
      })
      .addCase(addLessonCourse.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(fetchListChilByID.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchListChilByID.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(fetchListChilByID.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addQuizLessonInChapter.pending, (state) => {
        state.loading = true;
      })
      .addCase(addQuizLessonInChapter.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(addQuizLessonInChapter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteLessonInChapter.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteLessonInChapter.fulfilled, (state, action) => {
        state.loading = false;
        const updatedLessonList = state.lessonList.filter(
          (lesson) => lesson.id !== action.payload
        );
        state.lessonList = updatedLessonList;
      })
      .addCase(deleteLessonInChapter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteChapterInCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteChapterInCourse.fulfilled, (state, action) => {
        state.loading = false;
        const updatedChapterList = state.chapterList.filter(
          (chapter) => chapter.id !== action.payload
        );
        state.chapterList = updatedChapterList;
      })
      .addCase(deleteChapterInCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(putQuizInLesson.pending, (state) => {
        state.loading = true;
      })
      .addCase(putQuizInLesson.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(putQuizInLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(putLessonCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(putLessonCourse.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(putLessonCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default courseSlice;
