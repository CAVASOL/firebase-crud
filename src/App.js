import { useState, useEffect } from "react";
import { db } from "./firebase.config";
import { storage } from "./firebase.config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import "./App.css";

function App() {
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState(0);
  const [users, setUsers] = useState([]);
  const usersCollectionRef = collection(db, "users");
  const [imageUpload, setImageUpload] = useState(null);
  const [imageList, setImageList] = useState([]);

  const imageListRef = ref(storage, "images/");

  const uploadImage = async () => {
    if (imageUpload == null) {
      return;
    }

    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImageList((prev) => [...prev, url]);
      });
    });
  };

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
    listAll(imageListRef).then((res) => {
      res.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setImageList((prev) => [...prev, url]);
        });
      });
    });
  }, []);

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
          type="file"
          onChange={(e) => {
            setImageUpload(e.target.files[0]);
          }}
        />
        <button onClick={uploadImage}>Upload Image</button>
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

      {imageList.map((url, i) => {
        return <img src={url} key={i} alt="product" />;
      })}
    </div>
  );
}

export default App;
