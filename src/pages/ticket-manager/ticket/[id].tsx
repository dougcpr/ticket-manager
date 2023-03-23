import React from "react";
import {useRouter} from "next/router";

function Ticket() {
  const router = useRouter()
  const {id} = router.query;
  return (
    <>
      Hello Ticket {id}
    </>
  )
}

export default Ticket