import React from "react";
import {Button, Input, Spacer, Card} from "@geist-ui/core";
import {useRouter} from "next/router";
import { useFormik } from 'formik';
import {supabase} from "@/lib/supabaseClient";
import styled from "styled-components";

type LoginCredentials = {
  email: string,
  password: string
}

const CenterLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  place-items: center;
  -webkit-box-align: center;
  height: 100vh;
  width: 100%;
`

const LoginCard = styled(Card)`
  width: 20rem !important;
  margin: 2rem;
`

function Login() {
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    onSubmit: async (values: LoginCredentials) => {
      try {
        await supabase.auth.signUp(values);
        // show successful sign up / check email for verification ? / naivgate user back to sign in
      } catch (err) {
        console.error(err)
      } finally {}
      formik.handleReset({})
    },
  });
  return (
    <CenterLayout>
      <LoginCard>
        <Input id="email" name="email" label="Email" placeholder="" onChange={formik.handleChange} value={formik.values.email}/>
        <Spacer h={2}/>
        <Input.Password id="password" name="password" label="Password" placeholder="" onChange={formik.handleChange} value={formik.values.password}/>
        <Spacer h={2}/>
        <Button style={{width: "100%"}} onClick={() => formik.handleSubmit()}>Sign Up</Button>
      </LoginCard>
    </CenterLayout>
  )
}

export default Login