import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { login } from "../../redux/slice/authSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { FieldInput, FieldContainer, Submit } from "./Auth.style";

export const SignInPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const initialValues = {
    username: "",
    password: "",
  };
  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Введите свой логин"),
    password: Yup.string()
      .required("Это поле обязательно для заполнения")
      .min(6, "Пароль слишком короткий")
      .matches(/[a-zA-Z]/, "Используйте только латинские буквы a-z"),
  });

  const handleLogin = (formValue: { username: string; password: string }) => {
    const { username, password } = formValue;
    setLoading(true);

    dispatch(login({ username, password }))
      .unwrap()
      .then(() => {
        navigate("/");
      })
      .catch(() => {
        setLoading(false);
      });
  };

  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2vh 0",
        textAlign: "center",
        width: "25vw",
        margin: "25vh auto",
      }}
    >
      <h1 style={{ fontSize: "2rem" }}>Авторизация</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleLogin}
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
            <Submit
              color="primary"
              htmlType="submit"
              disabled={!(isValid && dirty) || loading}
            >
              {loading ? "Загрузка..." : "Войти"}
            </Submit>
          </Form>
        )}
      </Formik>
    </div>
  );
};
