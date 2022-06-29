import { useEffect, useState } from "react";
import * as fcl from '@onflow/fcl';

export function useCurrentUser() {
  const [user, setUser] = useState({ addr: null, loggedIn: null, cid: null })
  useEffect(() => { fcl.currentUser().subscribe(setUser), [setUser] })
  return [user.addr, user.addr != null]
}
