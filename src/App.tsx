import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore/lite";
import "./App.css";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQSgKTVJ9164iqWeLpF8XJ1th2atmJkCc",
  authDomain: "testfirebase-c08ec.firebaseapp.com",
  projectId: "testfirebase-c08ec",
  storageBucket: "testfirebase-c08ec.appspot.com",
  messagingSenderId: "635190253530",
  appId: "1:635190253530:web:4ad96932774541e35b12e3",
};

type Todo = {
  id: string;
  todo: string;
};

const firebaseApp = initializeApp(firebaseConfig);
const firebaseDb = getFirestore(firebaseApp);
const todosCollection = collection(firebaseDb, "todos");

function App() {
  const [todos, setTodos] = useState<Todo[]>();
  const [todoInput, setTodoInput] = useState("");

  const fetchTodos = () => {
    getDocs(todosCollection).then((v) => {
      const todoList = v.docs.map(
        (doc) => ({ todo: doc.data().todo, id: doc.id } as Todo)
      );
      setTodos(todoList);
    });
  };

  const addTodo = async (todo: string) => {
    await addDoc(todosCollection, {
      todo,
    });
    setTodoInput("");
    fetchTodos();
  };

  const deleteTodo = async (id: string) => {
    await deleteDoc(doc(firebaseDb, "todos", id));
    fetchTodos();
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div>
      <div className="w-[400px] mx-auto mt-24">
        <h1>My todo list</h1>
        <div className="flex mt-4">
          <input
            value={todoInput}
            onChange={(e) => setTodoInput(e.target.value)}
            className="border border-gray-300 px-2 py-2  rounded-lg"
            type="text"
          />
          <button
            onClick={() => addTodo(todoInput)}
            className="ml-2 bg-blue-100 rounded-lg px-4"
          >
            Add todo
          </button>
        </div>
        <div className="mt-4">
          <ul className="space-y-4">
            {todos?.map((t) => (
              <li className="flex justify-between" key={t.todo}>
                <span>{t.todo}</span>
                <button
                  onClick={() => deleteTodo(t.id)}
                  className="bg-red-100 px-2 py-2 rounded-lg"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
