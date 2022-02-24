import React, { useState, useEffect } from "react"
import axios from "axios"

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [boats, setBoats] = useState([])
  const [totalTime, setTotalTime] = useState("")
  const [price, setPrice] = useState(10)
  const [moneyGiven, setMoneyGiven] = useState("")
  const [changeMoney, setChangeMoney] = useState("")

  useEffect(() => {
    axios
      .post(process.env.REACT_APP_DOMAIN + "api/account/loggedin", {
        token: localStorage.getItem("token"),
      })
      .then((res) => {
        if (res.data.loggedin === true) {
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

    const intervalUpdate = setInterval(() => {
      axios
        .post(process.env.REACT_APP_DOMAIN + "api/getboats", {
          token: localStorage.getItem("token"),
        })
        .then((res) => {
          setBoats(res.data.boats)
        })
        .catch((err) => console.log(err))
    }, 1000)

    return () => clearInterval(intervalUpdate)
  }, [])

  const calculateMoney = () => {
    setChangeMoney(moneyGiven - price)
  }

  const startBoat = (boatId) => {
    axios
      .post(process.env.REACT_APP_DOMAIN + "api/startboat", {
        token: localStorage.getItem("token"),
        boatId: boatId,
      })
      .then((res) => {
        if (res.data.status === "ok") {
          axios
            .post(process.env.REACT_APP_DOMAIN + "api/getboats", {
              token: localStorage.getItem("token"),
            })
            .then((res) => {
              setBoats(res.data.boats)
            })
            .catch((err) => console.log(err))
        }
      })
      .catch((err) => console.log(err))
  }
  const stopBoat = (boatId) => {
    if (totalTime !== "") {
      return window.alert("You have to finish your calculation before stopping the next boat")
    }
    axios
      .post(process.env.REACT_APP_DOMAIN + "api/stopboat", {
        token: localStorage.getItem("token"),
        boatId: boatId,
      })
      .then((res) => {
        setTotalTime(res.data.timePast)
        if (res.data.status === "ok") {
          axios
            .post(process.env.REACT_APP_DOMAIN + "api/getprice", {
              token: localStorage.getItem("token"),
              boatId: boatId,
            })
            .then((res) => {
              var perHour = Number(res.data.price)
              var hours = Number(totalTime.split(":")[0]) + 1
              setPrice(hours * perHour)
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
        }
      })
      .catch((err) => console.log(err))
  }
  return (
    <div>
      <h1>rent-a-boat</h1>
      <p>rent-a-boat is a website where you can manage all your boats which are rented</p>
      {loggedIn === false ? (
        <div>
          <a href="/account/login">
            <button>Login</button>
          </a>
          <a href="/account/signup">
            <button>Sign Up</button>
          </a>
        </div>
      ) : (
        //pov: du bist eingeloggt
        <div>
          <button
            onClick={(e) => {
              e.preventDefault()
              localStorage.removeItem("token")
              window.location.reload()
            }}
          >
            Logout
          </button>

          <a href="/control">
            <button>Control Panel</button>
          </a>
          <br />
          <br />
          {boats?.map((item, id) => (
            <div key={id}>
              <b>{item.boatName}</b> ({item.boatId}) <br />
              {item.inUse === false ? "00:00:00" : item.timePast} <br />
              {item.inUse === false && <button onClick={() => startBoat(item.boatId)}>Start</button>}
              {item.inUse === true && <button onClick={() => stopBoat(item.boatId)}>Stop</button>}
              <br />
              <br />
            </div>
          ))}
          {totalTime !== "" && (
            <div>
              Das Boot war so lange unterwegs: <b>{totalTime}</b> <br />
              Das kostet so viel: <b>{price}€</b> <br />
              Wie viel hat der Kunde gezahlt in €{" "}
              <input type="number" style={{ width: "50px" }} onInput={(event) => setMoneyGiven(event.target.value)} value={moneyGiven} />
              <button onClick={calculateMoney}>Enter</button> <br />
              {changeMoney !== "" && (
                <div>
                  Wechselgeld: <b>{changeMoney}€</b> <br />
                </div>
              )}
              <button
                onClick={() => {
                  setTotalTime("")
                  setMoneyGiven("")
                }}
              >
                Fertig
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
