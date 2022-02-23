import React, { useState, useEffect } from "react"
import axios from "axios"

export default function Control() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [boatId, setBoatId] = useState("")
  const [boatName, setBoatName] = useState("")
  const [errMsg, setErrMsg] = useState("")
  const [boatPrice, setBoatPrice] = useState("")
  const [boats, setBoats] = useState([])
  useEffect(() => {
    axios
      .post(process.env.REACT_APP_DOMAIN + "api/account/loggedin", {
        token: localStorage.getItem("token"),
      })
      .then((res) => {
        if (res.data.loggedin !== true) {
          return (window.location.href = "/")
        } else if (res.data.loggedin === true) {
          setLoggedIn(true)
        }
      })
      .catch((err) => console.log(err))
    axios
      .post(process.env.REACT_APP_DOMAIN + "api/getboats", {
        token: localStorage.getItem("token"),
      })
      .then((res) => {
        setBoats(res.data.boats)
      })
      .catch((err) => console.log(err))
  }, [])

  const reloadBoats = () => {
    axios
      .post(process.env.REACT_APP_DOMAIN + "api/getboats", {
        token: localStorage.getItem("token"),
      })
      .then((res) => {
        setBoats(res.data.boats)
      })
      .catch((err) => console.log(err))
  }

  const addBoat = () => {
    axios
      .post(process.env.REACT_APP_DOMAIN + "api/addboat", {
        token: localStorage.getItem("token"),
        boatId: boatId,
        boatName: boatName,
        price: boatPrice,
      })
      .then((res) => {
        setErrMsg(res.data.msg)
        setBoatId("")
        setBoatName("")
        setBoatPrice("")
        reloadBoats()
      })
      .catch((err) => console.log(err))
  }

  const editBoat = (what, boatId) => {
    if (what === "name") {
      let newval = window.prompt("Enter new boat name: ")
      if (newval === "") return
      axios
        .post(process.env.REACT_APP_DOMAIN + "api/editboat", {
          token: localStorage.getItem("token"),
          update: what,
          oldboatId: boatId,
          boatName: newval,
        })
        .then((res) => {
          if (res.data.status === "ok") {
            setErrMsg("Sucsessfully edited")
            reloadBoats()
          }
        })
        .catch((err) => console.log(err))
    } else if (what === "id") {
      let newval = window.prompt("Enter new boat ID: ")
      if (newval === "") return
      axios
        .post(process.env.REACT_APP_DOMAIN + "api/editboat", {
          token: localStorage.getItem("token"),
          update: what,
          oldboatId: boatId,
          boatName: boatName,
          boatId: newval,
        })
        .then((res) => {
          if (res.data.status === "ok") {
            setErrMsg("Sucsessfully edited")
            reloadBoats()
          }
        })
        .catch((err) => console.log(err))
    } else if (what === "price") {
      let newval = window.prompt("Enter new boat price: ")
      if (newval === "" || !Number(newval)) return
      axios
        .post(process.env.REACT_APP_DOMAIN + "api/editboat", {
          token: localStorage.getItem("token"),
          update: what,
          oldboatId: boatId,
          boatName: boatName,
          price: Number(newval),
        })
        .then((res) => {
          if (res.data.status === "ok") {
            setErrMsg("Sucsessfully edited")
            reloadBoats()
          }
        })
        .catch((err) => console.log(err))
    }
  }

  const deleteBoat = (boatId) => {
    axios
      .post(process.env.REACT_APP_DOMAIN + "api/deleteboat", {
        token: localStorage.getItem("token"),
        boatId: boatId,
      })
      .then((res) => {
        if (res.data.status === "ok") {
          setErrMsg("Sucsessfully edited")
          reloadBoats()
        }
      })
      .catch((err) => console.log(err))
  }

  return (
    <div>
      {loggedIn === true && (
        <div>
          <h1>Control Panel</h1>
          {errMsg}
          <h3>Neues Boot hinzufügen</h3>
          <input type="text" placeholder="Boot ID" onInput={(event) => setBoatId(event.target.value)} value={boatId} />
          <input type="text" placeholder="Boot Name" onInput={(event) => setBoatName(event.target.value)} value={boatName} />
          <input type="number" placeholder="Preis in € pro Stunde" onInput={(event) => setBoatPrice(event.target.value)} value={boatPrice} />
          <button onClick={addBoat}>Boot hinzufügen</button>
          <h3>Edit boats</h3>
          <button
            onClick={(e) => {
              e.preventDefault()
              axios
                .post("api/getboats", {
                  token: localStorage.getItem("token"),
                })
                .then((res) => {
                  setBoats(res.data.boats)
                })
                .catch((err) => console.log(err))
            }}
          >
            Reload
          </button>{" "}
          <br /> <br />
          {boats?.map((item, id) => (
            <div key={id}>
              Name: {item.boatName}{" "}
              <button
                onClick={(e) => {
                  e.preventDefault()
                  editBoat("name", item.boatId)
                }}
              >
                Edit
              </button>
              <br />
              Preis pro Stunde: {item.price}€{" "}
              <button
                onClick={(e) => {
                  e.preventDefault()
                  editBoat("price", item.boatId)
                }}
              >
                Edit
              </button>
              <br />
              ID: {item.boatId}{" "}
              <button
                onClick={(e) => {
                  e.preventDefault()
                  editBoat("id", item.boatId)
                }}
              >
                Edit
              </button>
              <br />
              <button onClick={() => deleteBoat(item.boatId)}>Delete</button> <br />
              <br />
            </div>
          ))}
        </div>
      )}
      <a href="/">
        <button>Back</button>
      </a>
    </div>
  )
}
