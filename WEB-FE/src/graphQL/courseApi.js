import { gql } from "@apollo/client";
import { graphQLClient } from "./api";

export const fetchCourse = async ({
  currentPage,
  pageSize,
  searchName,
  category,
}) => {
  const filter = {
    filter: {
      currentPage: currentPage,
      pageSize: pageSize,
      ...(currentPage && { currentPage }),
      ...(pageSize && { pageSize }),
      ...(searchName && { searchName }),
      ...(category && { category }),
    },
  };
  console.log(filter);
  try {
    const { data } = await graphQLClient.query({
      query: gql`
        query Query($filter: filterCourse) {
          getListCourse(filter: $filter) {
            info {
              currentPage
              pageSize
              totalPage
            }
            course {
              id
              title
              thumbnail
              price
              discount
              description
              total_student_join
              created_at
              time_available
              category
              requirement
              target
              updated_at
              status
            }
          }
        }
      `,
      variables: filter,
    });
    return data.getListCourse;
  } catch (error) {
    throw error;
  }
};

export const createCourseMutation = async (courseData) => {
  console.log(courseData);
  const dataSend = {
    course: courseData,
  };
  try {
    const { data } = await graphQLClient.mutate({
      mutation: gql`
        mutation Mutation($course: InputCreateNewCourse) {
          createCourse(course: $course) {
            id
            title
            thumbnail
            price
            discount
            description
            total_student_join
            created_at
            time_available
            category
            requirement
            target
            chapter {
              id
              course_id
              chapter_name
              chapter_order
              lessons {
                id
                course_chapter_id
                type_lesson
                video_id
                lesson_order
                quiz {
                  answer
                  options
                  question
                }
                pass_condition
                time_expect
                lesson_name
                isOpen
              }
            }
            updated_at
            status
          }
        }
      `,
      variables: dataSend,
    });
    console.log("data: ", dataSend);
    return data.createCourse;
  } catch (error) {
    console.log("error: ", error);
    throw new Error(error.message);
  }
};

export const loginByUserMutation = async (loginData) => {
  const dataSend = {
    course: courseData,
  };
  try {
    const { data } = await graphQLClient.mutate({
      mutation: gql`
        mutation Mutation($course: InputCreateNewCourse) {
          createCourse(course: $course) {
            title
            category
            created_at
            description
            discount
            time_available
            id
            price
            requirement
            target
            thumbnail
            total_student_join
          }
        }
      `,
      variables: dataSend,
    });
    console.log("data: ", data);
    return data.createCourse;
  } catch (error) {
    console.log("error: ", error);
    throw new Error(error.message);
  }
};

export const getCourseById = async (courseId) => {
  const courseById = {
    getDetailCourseId: courseId,
  };
  try {
    const { data } = await graphQLClient.query({
      query: gql`
        query Query($getDetailCourseId: ID!, $userId: ID) {
          getDetailCourse(id: $getDetailCourseId, user_id: $userId) {
            id
            title
            thumbnail
            price
            discount
            description
            total_student_join
            created_at
            time_available
            category
            requirement
            target
            chapter {
              id
              course_id
              chapter_name
              chapter_order
              lessons {
                id
                course_chapter_id
                type_lesson
                video_id
                lesson_order
                quiz {
                  answer
                  options
                  question
                }
                pass_condition
                time_expect
                lesson_name
                isOpen
              }
            }
            updated_at
            status
          }
        }
      `,
      variables: courseById,
    });
    return data.getDetailCourse;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getListChildren = async (parentID) => {
  const courseById = {
    getDetailCourseId: parentID,
  };
  try {
    const { data } = await graphQLClient.query({
      query: gql`
        query GetListChildrenByParentId($parentId: ID!) {
          getListChildrenByParentId(parent_id: $parentId) {
            id
            name
            username
          }
        }
      `,
      variables: {
        parentId: parentID,
      },
    });
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getListCommentByCourse = async (courseId) => {
  const commentByCourse = {
    courseId: courseId,
  };
  try {
    const { data } = await graphQLClient.query({
      query: gql`
        query Query($courseId: ID!) {
          getListCommentByCourse(course_id: $courseId) {
            id
            user_id
            parent_comment
            description
            course_id
            user {
              id
              email
              name
              password
              role
              status
              date_of_birth
              phone
              avatar
              gender
            }
          }
        }
      `,
      variables: commentByCourse,
    });
    return data.getListCommentByCourse;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const createCommentInCourse = async (commentData) => {
  console.log("Chạy tiếp vô đây");
  const commentInCourse = {
    comment: commentData,
  };
  console.log(commentInCourse);
  try {
    const { data } = await graphQLClient.mutate({
      mutation: gql`
        mutation Mutation($comment: InputCreateComment) {
          createComment(comment: $comment) {
            course_id
            description
            id
            parent_comment
            user_id
          }
        }
      `,
      variables: commentInCourse,
    });
    return data.createComment;
  } catch (error) {
    console.log("error: ", error);
    throw new Error(error.message);
  }
};

export const deleteCommentInCourse = async (commentId) => {
  console.log("Chạy tiếp vô đây");
  const commentInCourse = {
    deleteCommentId: commentId,
  };

  try {
    const { data } = await graphQLClient.mutate({
      mutation: gql`
        mutation DeleteComment($deleteCommentId: ID!) {
          deleteComment(id: $deleteCommentId) {
            course_id
            description
            id
            parent_comment
            user_id
          }
        }
      `,
      variables: commentInCourse,
    });
    return data.deleteComment;
  } catch (error) {
    console.log("error: ", error);
    throw new Error(error.message);
  }
};

export const getDetailChapterInCourse = async (chapterId) => {
  console.log("Chạy tiếp vô đây");
  // console.log("chapterId api", chapterId);
  const chapterIdInCourse = {
    getDetailCourseChapterId: chapterId,
  };

  try {
    const { data } = await graphQLClient.query({
      query: gql`
        query GetDetailCourseChapter($getDetailCourseChapterId: ID!) {
          getDetailCourseChapter(id: $getDetailCourseChapterId) {
            chapter_name
            chapter_order
            course_id
            id
            lessons {
              id
              course_chapter_id
              type_lesson
              video_id
              lesson_order
              quiz {
                answer
                options
                question
              }
              pass_condition
              time_expect
              lesson_name
              isOpen
            }
          }
        }
      `,
      variables: chapterIdInCourse,
    });
    return data.getDetailCourseChapter;
  } catch (error) {
    console.log("error: ", error);
    throw new Error(error.message);
  }
};

export const addChapterInCourse = async (chapterData) => {
  console.log("Chạy tiếp vô đây");
  const addChapter = {
    courseChapter: chapterData,
  };

  try {
    const { data } = await graphQLClient.mutate({
      mutation: gql`
        mutation Mutation($courseChapter: InputCourseChapter) {
          createCourseChapter(courseChapter: $courseChapter) {
            chapter_name
            chapter_order
            id
            course_id
          }
        }
      `,
      variables: addChapter,
    });
    return data.createCourseChapter;
  } catch (error) {
    console.log("error: ", error);
    throw new Error(error.message);
  }
};

export const addVideoInLesson = async (lessonData) => {
  const addLesson = {
    videoLesson: lessonData,
  };

  try {
    const { data } = await graphQLClient.mutate({
      mutation: gql`
        mutation CreateVideoLesson($videoLesson: InputCreateVideoLesson) {
          createVideoLesson(videoLesson: $videoLesson) {
            signedUrl {
              signedUrl
              path
              token
            }
          }
        }
      `,
      variables: addLesson,
    });
    return data.createVideoLesson;
  } catch (error) {
    console.log("error: ", error);
    throw new Error(error.message);
  }
};

export const addLessonInCourse = async (lessonData) => {
  console.log("Chạy tiếp vô đây");
  console.log("lesson data", lessonData);
  const addLesson = {
    courseLesson: lessonData,
  };

  try {
    const { data } = await graphQLClient.mutate({
      mutation: gql`
        mutation CreateVideoLesson($courseLesson: InputCourseLesson) {
          createCourseLesson(courseLesson: $courseLesson) {
            course_chapter_id
            id
            lesson_order
            time_expect
            type_lesson
            lesson_name
          }
        }
      `,
      variables: addLesson,
    });
    return data.createCourseLesson;
  } catch (error) {
    console.log("error: ", error);
    throw new Error(error.message);
  }
};

export const putChapterInCourse = async (chapterData) => {
  console.log("chapter data", chapterData);
  const putLesson = {
    courseChapter: chapterData,
  };

  try {
    const { data } = await graphQLClient.mutate({
      mutation: gql`
        mutation Mutation($courseChapter: InputCourseChapterUpdate) {
          updateCourseChapter(courseChapter: $courseChapter) {
            id
            course_id
            chapter_name
            chapter_order
            lessons {
              id
              course_chapter_id
              type_lesson
              video_id
              lesson_order
              quiz {
                answer
                options
                question
              }
              pass_condition
              time_expect
              lesson_name
              isOpen
            }
          }
        }
      `,
      variables: putLesson,
    });
    return data.updateCourseChapter;
  } catch (error) {
    console.log("error: ", error);
    throw new Error(error.message);
  }
};

export const deleteCourseById = async (courseId) => {
  const deleteCourse = {
    deleteCourseId: courseId,
  };

  try {
    const { data } = await graphQLClient.mutate({
      mutation: gql`
        mutation Mutation($deleteCourseId: ID!) {
          deleteCourse(id: $deleteCourseId) {
            id
            title
            thumbnail
            price
            discount
            description
            total_student_join
            created_at
            time_available
            category
            requirement
            target
            chapter {
              id
              course_id
              chapter_name
              chapter_order
              lessons {
                id
                course_chapter_id
                type_lesson
                video_id
                lesson_order
                quiz {
                  answer
                  options
                  question
                }
                pass_condition
                time_expect
                lesson_name
                isOpen
              }
            }
            updated_at
            status
          }
        }
      `,
      variables: deleteCourse,
    });
    return data.deleteCourse;
  } catch (error) {
    console.log("error: ", error);
    throw new Error(error.message);
  }
};

export const addQuizLesson = async (quizData) => {
  const addQuiz = {
    quizLesson: quizData,
  };

  try {
    const { data } = await graphQLClient.mutate({
      mutation: gql`
        mutation Mutation($quizLesson: InputCreateQuizLesson) {
          createQuizLesson(quizLesson: $quizLesson) {
            id
            course_chapter_id
            type_lesson
            video_id
            lesson_order
            quiz {
              answer
              options
              question
            }
            pass_condition
            time_expect
            lesson_name
            isOpen
          }
        }
      `,
      variables: addQuiz,
    });

    return data.createQuizLesson;
  } catch (error) {
    console.log("error: ", error);
    throw new Error(error.message);
  }
};

export const deleteLessonById = async (lessonId) => {
  const deleteLesson = {
    courseLessonId: lessonId,
  };

  try {
    const { data } = await graphQLClient.mutate({
      mutation: gql`
        mutation Mutation($courseLessonId: ID!) {
          deleteCourseLesson(course_lesson_id: $courseLessonId)
        }
      `,
      variables: deleteLesson,
    });

    return data.deleteCourseLesson;
  } catch (error) {
    console.log("error: ", error);
    throw new Error(error.message);
  }
};

export const deleteChapterById = async (chapterId) => {
  const deleteChapter = {
    courseChapterId: chapterId,
  };

  try {
    const { data } = await graphQLClient.mutate({
      mutation: gql`
        mutation Mutation($courseChapterId: ID!) {
          deleteCourseChapter(course_chapter_id: $courseChapterId) {
            id
            course_id
            chapter_name
            chapter_order
            lessons {
              id
              course_chapter_id
              type_lesson
              video_id
              lesson_order
              quiz {
                answer
                options
                question
              }
              pass_condition
              time_expect
              lesson_name
              isOpen
            }
          }
        }
      `,
      variables: deleteChapter,
    });

    return data.deleteCourseChapter;
  } catch (error) {
    console.log("error: ", error);
    throw new Error(error.message);
  }
};

export const updateQuizInLessonCourse = async (quizData) => {
  const updateQuiz = {
    quizLesson: quizData,
  };

  try {
    const { data } = await graphQLClient.mutate({
      mutation: gql`
        mutation Mutation($quizLesson: InputQuizUpdateQuestion) {
          updateCourseLessonQuiz(quizLesson: $quizLesson) {
            id
            course_chapter_id
            type_lesson
            video_id
            lesson_order
            quiz {
              answer
              options
              question
            }
            pass_condition
            time_expect
            lesson_name
            isOpen
          }
        }
      `,
      variables: updateQuiz,
    });

    return data.updateCourseLessonQuiz;
  } catch (error) {
    console.log("error: ", error);
    throw new Error(error.message);
  }
};

export const updateLessonInCourse = async (lessonData) => {
  const updateLesson = {
    lesson: lessonData,
  };

  try {
    const { data } = await graphQLClient.mutate({
      mutation: gql`
        mutation Mutation($lesson: InputUpdateLesson) {
          updateLesson(lesson: $lesson) {
            id
            course_chapter_id
            type_lesson
            video_id
            lesson_order
            quiz {
              answer
              options
              question
            }
            pass_condition
            time_expect
            lesson_name
            isOpen
          }
        }
      `,
      variables: updateLesson,
    });

    return data.updateLesson;
  } catch (error) {
    console.log("error: ", error);
    throw new Error(error.message);
  }
};
