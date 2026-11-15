export const USERNAME_EXISTS_QUERY = `
  query UsernameExists($username: String!) {
    usernameExists(username: $username) {
      exists
    }
  }
`;

export const LOGIN_MUTATION = `
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      success
      message
      user {
        id
        name
        username
        role
      }
    }
  }
`;

export const ADD_USER_MUTATION = `
  mutation AddUser($input: AddUserInput!) {
    addUser(input: $input) {
      id
      name
      username
    }
  }
`;
