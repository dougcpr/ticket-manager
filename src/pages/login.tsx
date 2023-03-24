import React from "react";
import {Button, Input, Spacer, Card, ButtonGroup} from "@geist-ui/core";
import {useRouter} from "next/router";
import { useFormik } from 'formik';
import {supabase} from "@/lib/supabaseClient";
import styled from "styled-components";
import Github from "@geist-ui/icons/github";
import Facebook from "@geist-ui/icons/facebook";
import Youtube from "@geist-ui/icons/youtube";
import Twitter from "@geist-ui/icons/twitter";

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

async function signInWithGithub() {
  try {
    const { data } = await supabase.auth.signInWithOAuth({
      provider: 'github'
    })
    console.log(data)
  } catch (e) {
    console.error(e)
  }
}

function Login() {
  const router = useRouter()
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    onSubmit: async (values: LoginCredentials) => {
      try {
        const {data, error} = await supabase.auth.signInWithPassword(values);
        console.log(data);
        if (data.session) login()
        if (error) console.error(error)
      } catch (err) {
        console.error(err)
      } finally {}
      formik.handleReset({})
    },
  });
  function login() {
    // set context for user auth
    router.push('/ticket-manager')
  }
  return (
    <CenterLayout>
      <LoginCard>
        <Input id="email" name="email" label="Email" placeholder="" onChange={formik.handleChange} value={formik.values.email}/>
        <Spacer h={2}/>
        <Input.Password id="password" name="password" label="Password" placeholder="" onChange={formik.handleChange} value={formik.values.password}/>
        <Spacer h={2}/>
        <Button style={{width: "100%"}} onClick={() => formik.handleSubmit()}>Login</Button>
        <Spacer h={0.5}/>
        <Button style={{width: "100%"}} onClick={() => router.push('/signup')}>Sign Up</Button>
        <Spacer h={0.5}/>
        <ButtonGroup style={{ margin: "0.25rem 0", display: "flex"}}>
          <Button style={{ width: "100%", display: "grid", alignItems: "center"}} type="secondary" ghost onClick={() => signInWithGithub()}><Github /></Button>
          <Button style={{ width: "100%",display: "grid", alignItems: "center"}} type="secondary" ghost disabled><Facebook /></Button>
          <Button style={{ width: "100%",display: "grid", alignItems: "center"}} type="secondary" ghost disabled><Youtube /></Button>
          <Button style={{ width: "100%",display: "grid", alignItems: "center"}} type="secondary" ghost disabled><Twitter /></Button>
        </ButtonGroup>
      </LoginCard>
    </CenterLayout>
  )
}

export default Login