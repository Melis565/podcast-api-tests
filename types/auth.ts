type Login = {
  email:string,
  password:string
};

//Login ve Register ı ayırmak için Register ı Login den extend ettik.
//Bu şekilde eklenen Login özellikleri Register da da olacak ve ana root a eklenecek
type Register = Login & {
 firstName:string,
 lastName:string
};

type AuthToken = {
  accessToken: string,
  expiresIn: number,
  refreshToken: string
}

export { Login, Register, AuthToken };