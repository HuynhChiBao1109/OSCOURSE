import { gql } from "@apollo/client";
import { graphQLClient } from "./api";

export const fetchTransactionByAdmin = async ({ currentPage, pageSize }) => {
  const filter = {
    filter: {
      currentPage: currentPage,
      pageSize: pageSize,
    },
  };
  try {
    const { data } = await graphQLClient.query({
      query: gql`
        query Transaction($filter: filterPage) {
          getListTransactionByAdmin(filter: $filter) {
            transaction {
              id
              transaction_code
              course_id
              children_id
              amount
              status
              created_at
              expired_at
              children_name
              course_name
            }
            info {
              currentPage
              pageSize
              totalPage
            }
          }
        }
      `,
      variables: filter,
    });
    console.log(data.getListTransactionByAdmin);
    return data.getListTransactionByAdmin;
  } catch (error) {
    throw error;
  }
};

export const payCourseAPI = async ({ courseId, childrenId }) => {
  const info = {
    courseId: courseId,
    childrenId: childrenId,
  };
  try {
    const { data } = await graphQLClient.mutate({
      mutation: gql`
        mutation Mutation($courseId: ID!, $childrenId: ID!) {
          payCourse(course_id: $courseId, children_id: $childrenId) {
            content
            amount
          }
        }
      `,
      variables: info,
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const getPaymentStatusAPI = async ({ content }) => {
  const info = {
    content: content,
  };
  try {
    const { data } = await graphQLClient.query({
      query: gql`
        query GetPaymentStatus($content: String!) {
          getPaymentStatus(content: $content) {
            status
          }
        }
      `,
      variables: info,
    });
    return data;
  } catch (error) {
    throw error;
  }
};
