import React from "react";
import {Button} from "@geist-ui/core";
import {useRouter} from "next/router";

function Login() {
  const router = useRouter()
  function login() {
    router.push('/ticket-manager')
  }
  return (
    <>
      <Button onClick={login}>Login</Button>
    </>
  )
}

export default Login