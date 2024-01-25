import React from 'react'
import "./navbar.css"
function Navbar({address}: {address: string}) {
  return (
    <nav>
      Connected Adress: {address}
    </nav>
  )
}

export default Navbar
