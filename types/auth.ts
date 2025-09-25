type Login = {
  email:string,
  password:string
};


type Register = Login & {
 firstName:string,
 lastName:string
};

export default Register;