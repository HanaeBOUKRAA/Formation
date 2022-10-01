import React, { useEffect, useState } from 'react';
import { Accounts } from 'meteor/accounts-base';
import {useTracker} from "meteor/react-meteor-data";

const FirstPage = () => {
  const [email , setEmail] = useState("");
  const [password , setPassword] = useState("");
  const [showSignin, setshowSignin] = useState(false);

  const saveEmail = (e) => {
    setEmail(e.target.value);
  }

  const savePassword = (e) => {
    setPassword(e.target.value);
  }

  const createUser = (e) => {
    e.preventDefault();
    Accounts.createUser(
      {email, password}, (error) => error && console.log(error.message));
  }

  const signInUser = (e) => {
    e.preventDefault();
    Meteor.loginWithPassword(email, password, ( error ) => error && console.log(error.message));
  }

  return (
    <form>
      {showSignin ? <h1>Log in to our website</h1>:<h1>Create A new Account</h1>}
      <label htmlFor="">email:</label>
      <input type="email" onChange={saveEmail} required/> <br /> <br />
      <label htmlFor="">password:</label>
      <input type="password" onChange={savePassword} required/> <br /> <br />
      <div>
        {showSignin ?
        <>
          <button type="submit" onClick={signInUser}>SIGN IN</button> <br /> <br />
          <a onClick={() => setshowSignin(!showSignin)} href="#">do you want to create an account ?</a>
        </>
        :
        <>
          <button type="submit" onClick={createUser}>SIGN UP</button> <br /> <br />
          <a onClick={() => setshowSignin(!showSignin)} href="#">do you already have an account ?</a>
        </>
      }
      </div>
  </form>
  );
}

const data = [
  {"from": "ernando@gmail.com", "to": "Mohamed@gmail.com", "content": "Hello !", id:1},
  {"to": "ernando@gmail.com", "from": "Mohamed@gmail.com", "content": "Hi !", id:2},
  {"from": "ernando@gmail.com", "to": "Mohamed@gmail.com", "content": "Whatsupp !", id:3},
  {"to": "ernando@gmail.com", "from": "Mohamed@gmail.com", "content": "I am good hbu ?", id:4},
  {"from": "ernando@gmail.com", "to": "Mohamed@gmail.com", "content": "I am great !", id:5},
  {"from": "ernando@gmail.com", "to": "Mohamed@gmail.com", "content": "Any new News about the project ?", id:6},
  {"to": "ernando@gmail.com", "from": "Mohamed@gmail.com", "content": "NAh, not yet!", id:6},
]

const msgStyles = {marginRight: 20, padding: 5, margin:5, color: "red", textAlign: "left", border: "1px solid #000", borderRadius: 10, borderBottomLeftRadius: 0 }
const SendMessageComponent = ({email, sendMssg, setSendMssg}) => {
  return (
    <div style={{maxWidth: 300,}}>

      <form>
        <h3>Send to: {email}</h3>
        <ul style={{listStyle: 'none', maxWidth: 200}}>
          {
            data.map((item) => {
              return (
                item.from === email ? 
                <li key={item.id} style={{...msgStyles, marginRight: 55}}>
                  {item.content}
                </li>
                :
                <li key={item.id} style={{...msgStyles, color: "green", textAlign: "right", borderBottomRightRadius: 0, borderBottomLeftRadius: 10,  marginLeft: 55}}>
                  {item.content}
                </li>    
            );
          })
        }
        </ul>
        <textarea style={{width: '100%',}} name="" id="" cols="30" rows="10"></textarea> <br /> <br />
        <div style={{display: "flex", justifyContent: "space-between"}}>
          <button type="submit">Send Message</button>
          <button onClick={() => setSendMssg(!sendMssg)}>RETURN</button>
        </div>
      </form>
    </div>
  );
}
const UsersPage = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [sendMssg, setSendMssg] = useState(false);
  const [toEmail, setToEmail] = useState("");
  
  useEffect(() => {
    Meteor.call('getAllUsers', (err, data) =>  !err && setAllUsers(data));
    return (() => setAllUsers([]));
  }, [])

  useEffect(() => {
    console.log("All users:", allUsers);
  }, [allUsers])

  const logOut = () => {
    Accounts.logout();
  }

  return (
    <>
    {sendMssg ?
    <SendMessageComponent email={toEmail} sendMssg= {sendMssg} setSendMssg={setSendMssg} />
    :
    <>
      <h1>Welcome to Meteor!</h1>
      <h3>Users of our small website:</h3>
      <ul>
        {allUsers.map(user => 
        <li key={user["_id"]}> 
        <span>
          user :{user["emails"].map(e => e.address)} 
        </span>
          <button 
          style={{margin: 5,}}
          onClick={() => {
            setSendMssg(!sendMssg);
            setToEmail(user["emails"][0]["address"]);
            console.log("to email:", user["emails"][0]["address"]);
          }}>
            SEND MESSAGE
          </button>
        </li>)
        }
      </ul>
      <button onClick={logOut}>LOG OUT</button>
      </>
  } 
    </>
  )
}

export const HomePage = () => {
  const user = useTracker(() => Meteor.user());
  useEffect(() => {
    console.log("Current User:", user);
  }, [user]);

  return (
    <>
      {user ? <UsersPage /> : <FirstPage/>}
    </>
  );
};