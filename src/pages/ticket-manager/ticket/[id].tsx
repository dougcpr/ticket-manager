import React from "react";
import {useRouter} from "next/router";
import {supabase} from "@/lib/supabaseClient";

function Ticket() {
  const router = useRouter()
  const {id} = router.query;
  return (
    <>
      Hello Ticket {id}
    </>
  )
}

export async function getServerSideProps({ req } : any) {

  const { user } = await supabase.auth.api.getUserByCookie(req)

  if (!user) {
    // If no user, redirect to index.
    return { props: {}, redirect: { destination: '/', permanent: false } }
  }

  // If there is a user, return it.
  // TODO: Fix. Feels Bad
  return { props: { user } }

}

export default Ticket