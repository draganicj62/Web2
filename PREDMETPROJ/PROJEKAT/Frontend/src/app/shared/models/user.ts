export interface LoginUser {
    email: string,
    password: string,
}

export interface RegistrationUser{
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    birthday: Date,
    address: string,
    password: string,
    role: string,
    //picture: File,
}

export interface UpdateUser{
    id: number,
    username: string,
    email: string,
    newpassword: string,
    oldpassword: string,
    firstName: string,
    lastName: string,
    birthday: Date,
    address: string
}

export interface UserAuthorization{
    unique_name: string, //email
    nameid: string,      //id
    role: string,        //role
}

export interface LogGogle{
    username: string, //email
    role: string,        //role
    id: number,
}

export interface UserDetails{
    id: number,
    username: string,
    email: string,
    firstName: string,
    lastName: string,
    birthday: Date,
    address: string,
    picture: string,
    verificationStatus: string
  }
