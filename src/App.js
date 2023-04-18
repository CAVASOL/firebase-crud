import { useState, useEffect } from "react";
import { db } from "./firebase.config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import "./App.css";

function App() {
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState(0);
  const [users, setUsers] = useState([]);
  const usersCollectionRef = collection(db, "users");

  const createUser = async () => {
    await addDoc(usersCollectionRef, { name: newName, age: Number(newAge) });
  };

  const updateUser = async (id, age) => {
    const userDoc = doc(db, "users", id);
    const newFields = { age: age + 1 };
    await updateDoc(userDoc, newFields);
  };

  const deleteUser = async (id) => {
    const userDoc = doc(db, "users", id);
    await deleteDoc(userDoc);
  };

  useEffect(() => {
    const getUsers = async () => {
      const usersSnapshot = await getDocs(usersCollectionRef);
      setUsers(
        usersSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    };

    getUsers();
  }, [usersCollectionRef]);

  return (
    <div className="App">
      <div
        className="input-field"
        style={{ display: "grid", justifyContent: "center" }}
      >
        <input
          type="text"
          placeholder="Enter your name"
          onChange={(e) => setNewName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Enter your age"
          onChange={(e) => setNewAge(e.target.value)}
        />
        <button onClick={createUser}>Create User</button>
      </div>
      {users.map((user) => {
        return (
          <div key={user.id}>
            <h2>Name: {user.name}</h2>
            <h2>Age: {user.age}</h2>
            <button
              onClick={(e) => {
                updateUser(user.id, user.age);
              }}
            >
              Increase Age
            </button>
            <button
              onClick={(e) => {
                deleteUser(user.id);
              }}
            >
              Delete User
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default App;
