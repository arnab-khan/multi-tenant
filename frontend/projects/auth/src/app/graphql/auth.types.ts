export interface GraphqlError {
  message: string;
  locations?: Array<{ line: number; column: number }>;
  path?: Array<string | number>;
  extensions?: Record<string, unknown>;
}

export interface GraphqlResponse<T> {
  data?: T | null;
  errors?: GraphqlError[];
}

export interface UsernameExistsVariables {
  username: string;
}

export interface UsernameExistsData {
  usernameExists: {
    exists: boolean;
  };
}

export interface AddUserInput {
  name: string;
  username: string;
  password: string;
}

export interface AddUserData {
  addUser: {
    id: string;
    name: string;
    username: string;
  };
}
