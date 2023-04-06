import React, {FC} from "react";
import {Button, Input, Spacer, Card, ButtonGroup} from "@geist-ui/core";
import {useRouter} from "next/router";
import { useFormik } from 'formik';
import {supabase} from "@/lib/supabaseClient";
import Github from "@geist-ui/icons/github";
import Facebook from "@geist-ui/icons/facebook";
import Youtube from "@geist-ui/icons/youtube";
import Twitter from "@geist-ui/icons/twitter";

type LoginCredentials = {
  email: string,
  password: string
}

async function signInWithGithub() {
  try {
    await supabase.auth.signInWithOAuth({
      provider: 'github'
    })
  } catch (e) {
    console.error(e)
  }
}

type AppLayoutProps = {
  setSession: any;
};

const SignIn: FC<AppLayoutProps> = ({setSession}) => {
  const router = useRouter()
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    onSubmit: async (values: LoginCredentials) => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword(values);
        if (data.session) setSession(data.session)
        // TODO: Show toast for successful sign in
        if (error) console.error(error)
      } catch (err) {
        console.error(err)
      } finally {}
      formik.handleReset({})
    },
  });
  return (
    <div style={{display: 'grid', gridTemplateColumns: "1fr", placeItems: "center", height: "100vh", width: "100%"}}>
      <Card style={{width: "20rem", margin: "2rem"}}>
        <Input id="email" name="email" placeholder="" label="Email" width="100%" onChange={formik.handleChange} value={formik.values.email}/>
        <Spacer h={2}/>
        <Input.Password id="password" name="password" placeholder="" label="Password" width="100%" onChange={formik.handleChange} value={formik.values.password}/>
        <Spacer h={2}/>
        <Button type="success" style={{width: "100%"}} onClick={() => formik.handleSubmit()}>Login</Button>
        <Spacer h={0.5}/>
        <Button type="success" style={{width: "100%"}} onClick={() => router.push('/sign-up')}>Sign Up</Button>
        <Spacer h={0.5}/>
        <ButtonGroup style={{ margin: "0.25rem 0", display: "flex"}}>
          <Button style={{ width: "100%", display: "grid", alignItems: "center"}} type="secondary" ghost onClick={() => signInWithGithub()}><Github /></Button>
          <Button style={{ width: "100%",display: "grid", alignItems: "center"}} type="secondary" ghost disabled><Facebook /></Button>
          <Button style={{ width: "100%",display: "grid", alignItems: "center"}} type="secondary" ghost disabled><Youtube /></Button>
          <Button style={{ width: "100%",display: "grid", alignItems: "center"}} type="secondary" ghost disabled><Twitter /></Button>
        </ButtonGroup>
      </Card>
    </div>
  )
}

export default SignIn