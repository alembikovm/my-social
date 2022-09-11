import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { from, map, Observable, switchMap } from 'rxjs';
import { executeQuery } from 'src/main';
import { User } from '../models/user.enum';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}
  async getUser(userId) {
    const user = await executeQuery(
      `SELECT
      id, firstName, lastName, email
      FROM user 
      WHERE id="${userId}"
      LIMIT 1`,
    );

    return user[0];
  }

  async findUser(id) {
    const user = await executeQuery(
      `SELECT
      id, firstName, lastName, email
      FROM user 
      WHERE id="${id}" 
      LIMIT 1`,
    );

    return user[0];
  }

  async createUser({ firstName, lastName, email, password, role = 'user' }) {
    await executeQuery(`INSERT INTO user (firstName, lastName, email, password, role)
    VALUES ("${firstName}","${lastName}","${email}","${password}","${role}")
    `);

    const getCreatedUserData = await executeQuery(
      `SELECT
      id, firstName, lastName, email
      FROM user 
      ORDER BY id DESC
      LIMIT 1`,
    );

    return getCreatedUserData;
  }

  async selectUser(email) {
    const user = await executeQuery(
      `SELECT
        id, firstName, lastName, email, password, role
        FROM user 
        WHERE email = '${email}'
        ORDER BY id DESC
        LIMIT 1`,
    );

    return user[0];
  }

  hashPassword(password: string): Observable<string> {
    return from(bcrypt.hash(password, 12));
  }

  registerAccount(user: User): Observable<User> {
    const { firstName, lastName, email, password, role } = user;

    return this.hashPassword(password).pipe(
      switchMap((hashedPassword: string) => {
        return from(
          this.createUser({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role,
          }),
        );
      }),
    );
  }

  validateUser(email: string, password: string): Observable<User> {
    return from(this.selectUser(email)).pipe(
      switchMap((user: User) =>
        from(bcrypt.compare(password, user.password)).pipe(
          map((isValidPassword: boolean) => {
            if (isValidPassword) {
              delete user.password;

              return user;
            }
          }),
        ),
      ),
    );
  }

  login(user: User): Observable<string> {
    const { email, password } = user;

    return this.validateUser(email, password).pipe(
      switchMap((user: User) => {
        if (user) {
          return from(this.jwtService.signAsync({ user }));
        }
      }),
    );
  }
}
