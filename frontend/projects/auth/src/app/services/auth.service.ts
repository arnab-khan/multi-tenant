import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ADD_USER_MUTATION, LOGIN_MUTATION, USERNAME_EXISTS_QUERY } from '../graphql/auth.queries';
import type {
  AddUserData,
  AddUserInput,
  GraphqlResponse,
  LoginData,
  LoginInput,
  UsernameExistsData,
  UsernameExistsVariables,
} from '../graphql/auth.types';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  login(input: LoginInput) {
    return this.http.post<GraphqlResponse<LoginData>>('http://localhost:8080/graphql', {
      operationName: 'Login',
      query: LOGIN_MUTATION,
      variables: { input },
    }, { withCredentials: true });
  }

  addUser(input: AddUserInput) {
    return this.http.post<GraphqlResponse<AddUserData>>('http://localhost:8080/graphql', {
      operationName: 'AddUser',
      query: ADD_USER_MUTATION,
      variables: { input },
    });
  }

  usernameExists(username: string) {
    const variables: UsernameExistsVariables = { username };

    return this.http.post<GraphqlResponse<UsernameExistsData>>('http://localhost:8080/graphql', {
      operationName: 'UsernameExists',
      query: USERNAME_EXISTS_QUERY,
      variables,
    });
  }
}
