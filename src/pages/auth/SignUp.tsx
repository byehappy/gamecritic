import { useState } from "react";
import {  useAppDispatch } from "../../redux/hooks";
import * as Yup from "yup";
import { register } from "../../redux/slice/authSlice";
import { Formik, Field, ErrorMessage, Form } from "formik";
import { FieldContainer, FieldInput, Submit } from "./Auth.style";
import { Link } from "react-router-dom";

export const SignUpPage = () => {
  const [successful, setSuccessful] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const initialValues = {
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Неверный формат email")
      .required("Это поле обязательно для заполнения"),
    password: Yup.string()
      .required("Это поле обязательно для заполнения")
      .min(6, "Пароль слишком короткий")
      .matches(/[a-zA-Z]/, "Используйте только латинские буквы a-z"),
    confirmPassword: Yup.string()
      .required("Это поле обязательно для заполнения")
      .oneOf([Yup.ref("password")], "Пароли не совпадают"),
    username: Yup.string()
      .required("Это поле обязательно для заполнения")
      .min(4, "Имя слишком короткое")
      .matches(/[a-zA-Z]/, "Используйте только латинские буквы a-z"),
  });

  const handleRegister = (formValue: {
    username: string;
    email: string;
    password: string;
  }) => {
    const { username, email, password } = formValue;
    setLoading(true);
    setSuccessful(false);

    dispatch(register({ username, email, password }))
      .unwrap()
      .then(() => {
        setSuccessful(true);
      })
      .catch(() => {
        setSuccessful(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2vh 0",
        textAlign: "center",
        width: "25vw",
        margin: "15vh auto",
      }}
    >
      <h1 style={{ fontSize: "2rem" }}>Регистрация</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleRegister}
      >
        {({ isValid, dirty }) => (
          <Form
            id="sign-in-form"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1vh 0",
            }}
          >
            {!successful ? (
              <>
                <FieldContainer>
                  Почта
                  <Field
                    type="email"
                    name="email"
                    placeholder="Почта"
                    as={FieldInput}
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="ErrorMessages"
                  />
                </FieldContainer>
                <FieldContainer>
                  Имя пользователя
                  <Field
                    type="username"
                    name="username"
                    placeholder="Имя пользователя"
                    as={FieldInput}
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="ErrorMessages"
                  />
                </FieldContainer>
                <FieldContainer>
                  Пароль
                  <Field type="password" name="password" as={FieldInput} />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="ErrorMessages"
                  />
                </FieldContainer>
                <FieldContainer>
                  Подтвердите пароль
                  <Field
                    type="password"
                    name="confirmPassword"
                    as={FieldInput}
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="ErrorMessages"
                  />
                </FieldContainer>
                <Submit
                  color="primary"
                  htmlType="submit"
                  disabled={!(isValid && dirty) || loading}
                >
                  {loading ? "Загрузка..." : "Зарегистрироваться"}
                </Submit>
              </>
            ) : (
              <div>Вы успешно зарегистрировались. <Link to="/auth/sign-in">Войти</Link></div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};
