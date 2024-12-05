import { gql } from "@apollo/client";
import { graphQLClient } from "./api";

export const fetchUser = async ({
  currentPage,
  pageSize,
  searchName,
  role,
}) => {
  const query = {
    filter: {
      ...(currentPage && { currentPage }),
      ...(pageSize && { pageSize }),
      ...(searchName && { searchName }),
      ...(role && { role }),
    },
  };

  try {
    const { data } = await graphQLClient.query({
      query: gql`
        query User($filter: FilterUser) {
          getListUser(filter: $filter) {
            user {
              id
              name
              email
              password
              role
              status
              date_of_birth
              phone
              avatar
              gender
            }
            info {
              totalPage
              pageSize
              currentPage
            }
          }
        }
      `,
      variables: query,
    });
    return data.getListUser;
  } catch (error) {
    throw error;
  }
};

export const createUserMutation = async (userData) => {
  console.log("graph: " + JSON.stringify(userData));
  try {
    const { data } = await graphQLClient.mutate({
      mutation: gql`
        mutation Mutation($user: UserInputCreate!) {
          createUser(user: $user) {
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
      `,
      variables: {
        user: userData,
      },
    });
    console.log("data: ", data);
    return data.createUser;
  } catch (error) {
    console.log("error: ", error);
    throw new Error(error.message);
  }
};

export const createParentMutation = async (userData) => {
  console.log("graph: " + JSON.stringify(userData));
  try {
    const { data } = await graphQLClient.mutate({
      mutation: gql`
        mutation RegisterParent($user: ParentInputCreate!) {
          registerParent(user: $user) {
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
      `,
      variables: {
        user: userData,
      },
    });
    console.log("data: ", data);
    return data.registerParent;
  } catch (error) {
    console.log("error: ", error);
    throw new Error(error.message);
  }
};

export const createChildrenMutation = async (userData) => {
  console.log("graph: " + JSON.stringify(userData));
  try {
    const { data } = await graphQLClient.mutate({
      mutation: gql`
        mutation RegisterChildren($children: ChildrenInputCreate!) {
          registerChildren(children: $children) {
            id
            name
            date_of_birth
            password
            parent_id
            avatar
            gender
            username
            role
          }
        }
      `,
      variables: {
        children: userData,
      },
    });
    console.log("data: ", data);
    return data.createUser;
  } catch (error) {
    console.log("error: ", error);
    throw new Error(error.message);
  }
};

export const checkChildrenOrParentExistMutation = async (userData) => {
  try {
    const { data } = await graphQLClient.mutate({
      mutation: gql`
        mutation CheckChildrenUserNameExist(
          $childrenUsername: String!
          $parentEmail: String!
        ) {
          checkChildrenUserNameExist(
            children_username: $childrenUsername
            parent_email: $parentEmail
          )
        }
      `,
      variables: {
        childrenUsername: userData.childrenUsername,
        parentEmail: userData.parentEmail,
      },
    });
    console.log("data: ", data);
    return data.createUser;
  } catch (error) {
    console.log("error: ", error);
    throw new Error(error.message);
  }
};

export const loginByUser = async (userData) => {
  console.log("graph: " + JSON.stringify(userData));
  try {
    const { data } = await graphQLClient.mutate({
      mutation: gql`
        mutation loginByUser($user: LoginUser!) {
          loginByUser(user: $user) {
            token
            User {
              id
              email
              name
              password
              role
              status
              date_of_birth
              phone
              avatar
            }
          }
        }
      `,
      variables: {
        user: userData,
      },
    });
    console.log("data: ", data);
    return data;
  } catch (error) {
    console.log("error: ", error);
    throw new Error(error.message);
  }
};

export const loginByChildren = async (userData) => {
  console.log("loginByChildren: " + JSON.stringify(userData));
  try {
    const { data } = await graphQLClient.mutate({
      mutation: gql`
        mutation LoginByChildren($children: LoginChildren!) {
          loginByChildren(children: $children) {
            Children {
              id
              name
              date_of_birth
              password
              avatar
              parent_id
              gender
              username
              role
            }
            token
          }
        }
      `,
      variables: {
        children: userData,
      },
    });
    console.log("data: ", data);
    return data;
  } catch (error) {
    console.log("error: ", error);
    throw new Error(error.message);
  }
};

export const getUserById = async (userId) => {
  console.log("getUserById: " + userId);
  try {
    const { data } = await graphQLClient.query({
      query: gql`
        query User($userId: ID!) {
          user(id: $userId) {
            age
            name
            password
            email
            id
            role
            status
          }
        }
      `,
      variables: {
        userId,
      },
    });
    return data.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const forgotPass = async (email) => {
  console.log("email: " + email);
  try {
    const { data } = await graphQLClient.mutate({
      mutation: gql`
        mutation ForgotPassword($email: String!) {
          forgotPassword(email: $email) {
            message
            code
          }
        }
      `,
      variables: {
        email,
      },
    });
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteUserAPI = async (userID) => {
  console.log("userID: " + userID);
  try {
    const { data } = await graphQLClient.mutate({
      mutation: gql`
        mutation DeleteUser($deleteUserId: ID!) {
          deleteUser(id: $deleteUserId) {
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
      `,
      variables: {
        deleteUserId: userID,
      },
    });
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};
