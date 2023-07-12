import { Formik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [, setError] = useState('');
  const navigate = useNavigate();

  const INITIAL_VALUES = {
    email: '',
    password: '',
  }

  const VALIDATION_SCHEMA = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email')
      .required('Required'),
    password: Yup.string()
      .required('Required'),
  });

  return (
    <>
      <Formik
        validationSchema={VALIDATION_SCHEMA}
        initialValues={INITIAL_VALUES}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          try {
            const response = await axios.post(`http://${process.env.REACT_APP_API_URL}/auth/login`, {
              email: values.email,
              password: values.password
            }, { timeout: 10000 });

            await AsyncStorage.setItem('token', response.data.accessToken.jwtToken);
            console.log('Token saved');

            console.log(response.data.accessToken.jwtToken);
            navigate('/messenger', { email: values.email, token: response.data.accessToken.jwtToken });
          } catch (error) {
            setError('');
            if (error.response && error.response.data.message) {
              setError(error.response.data.message);
            }
          } finally {
            setSubmitting(false);
            resetForm();
          }
        }}
      >
        {(formik) => {
          const {
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
          } = formik;

          return (
            <div className="w-360 mx-auto py-8">
              <div className="relative z-10 bg-white rounded-2xl max-w-[360px] mx-auto mb-20 p-10 text-center">
                <form noValidate onSubmit={handleSubmit}>
                  <span>Login</span>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none relative block w-full px-3 py-2 placeholder-white text-black rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm text-black bg-blue-50 text-black"
                    placeholder="Email address"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <p className="error">
                    {errors.email && touched.email && errors.email}
                  </p>
                  <input
                    type="password"
                    name="password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                    placeholder="Enter password"
                    className="outline-none bg-gray-200 w-full border-0 rounded-5 my-0.5 py-3 px-4 box-border text-base"
                  />
                  <p className="error">
                    {errors.password && touched.password && errors.password}
                  </p>
                  <button
                    className="text-white font-bold text-base uppercase outline-none bg-blue-500 w-full rounded-5 py-3 px-4 transition-all duration-300 ease-cubic cursor-pointer"
                    type="submit"
                  >
                    Login
                  </button>
                </form>
              </div>
            </div>
          )
        }}
      </Formik>
    </>
  );
}

export default Login;
