import {Formik, Field, Form, useFormik} from 'formik'
import type { NextPage } from "next";
import { useState } from "react";


const Login = () => {
  
  return (
    <body className="bg-orange-300 m-0 p-0 h-full">
        <div className="flex align-middle justify-center">
            <div className="bg-white table w-80 my-0 mx-auto align-middle">
                <Formik
                    initialValues={{
                        email: '',
                        password: '',
                    }}

                    onSubmit={() => {
                        

                    }}
                >
                    <Form>
                        <Field id="email" name="email" placeholder="email" />
                        <Field type="password" id="password" name="password" placeholder="Password" />
                        <button type="submit">Login</button>
                    </Form>
                </Formik>
            </div>

        </div>
    </body>
  );
  
};

export default Login;
