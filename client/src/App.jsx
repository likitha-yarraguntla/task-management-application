import { useEffect, useMemo, useState } from "react";

function App() {
  // AUTH
  const [loggedIn, setLoggedIn] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [signupName, setSignupName] = useState("");
  const [signupUser, setSignupUser] = useState("");
  const [signupPass, setSignupPass] = useState("");

  // TASK STATES
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  // FEATURES
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const [priority, setPriority] =
    useState("Medium");

  const [dueDate, setDueDate] = useState("");

  const [category, setCategory] =
    useState("Study");

  const [filter, setFilter] = useState("All");

  // LOAD TASKS
    // LOAD TASKS (ఇది మీ పాత useEffect ని రీప్లేస్ చేస్తుంది)
    useEffect(() => {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (currentUser) {
    // ప్రతి యూజర్‌కి ఒక సెపరేట్ కీ ("tasks_username") క్రియేట్ అవుతుంది
         const saved = localStorage.getItem(`tasks_${currentUser.username}`);
         setTasks(saved ? JSON.parse(saved) : []);
      }
}, [loggedIn]);

   // SAVE TASKS (ఇది కూడా పాతదాన్ని రీప్లేస్ చేయాలి)
useEffect(() => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (currentUser) {
    localStorage.setItem(`tasks_${currentUser.username}`, JSON.stringify(tasks));
  }
}, [tasks]);  
  // ADD TASK
  const addTask = () => {
    if (task.trim() === "") {
      alert("Please enter a task");
      return;
    }

    const newTask = {
      text: task,
      completed: false,
      priority,
      due: dueDate,
      category,
      createdAt:
        new Date().toLocaleDateString(),
    };

    setTasks([...tasks, newTask]);

    setTask("");
    setDueDate("");
  };

  // DELETE TASK
  const deleteTask = (index) => {
    const updated = tasks.filter(
      (_, i) => i !== index
    );

    setTasks(updated);
  };

  // COMPLETE TASK
  const completeTask = (index) => {
    const updated = [...tasks];

    updated[index].completed =
      !updated[index].completed;

    setTasks(updated);
  };

  // EDIT TASK
  const editTask = (index) => {
    const updatedText = prompt(
      "Edit your task",
      tasks[index].text
    );

    if (updatedText) {
      const updated = [...tasks];

      updated[index].text = updatedText;

      setTasks(updated);
    }
  };
const handleSignup = () => {
  if (!signupName || !signupUser || !signupPass) {
    alert("Fill all fields");
    return;
  }
  
  // 1. ఉన్న యూజర్లను తెచ్చుకోండి (లేకపోతే ఖాళీ లిస్ట్)
  const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
  
  // 2. కొత్త యూజర్‌ని క్రియేట్ చేయండి
  const newUser = { name: signupName, username: signupUser, password: signupPass };
  
  // 3. లిస్టులో కొత్త యూజర్‌ని యాడ్ చేసి సేవ్ చేయండి
  localStorage.setItem("users", JSON.stringify([...existingUsers, newUser]));
  
  alert("Account Created Successfully!");
  setShowSignup(false);
  setSignupName("");
  setSignupUser("");
  setSignupPass("");
};  

const handleLogin = () => {
  // ఇక్కడ 'user' బదులు 'users' అనే Array ని వాడుతున్నాము
const users = JSON.parse(localStorage.getItem("users") || "[]");
const savedUser = users.find(u => u.username === username);


  if (!savedUser) {
    alert(
      "No account found. Please sign up first."
    );
    return;
  }

  if (
    username === savedUser.username &&
    password === savedUser.password
  ) {
    setLoggedIn(true);
    localStorage.setItem("currentUser", JSON.stringify(savedUser));
  } else {
    alert(
      "Invalid username or password"
    );
  }
};
// LOGOUT FUNCTION
const handleLogout = () => {
  localStorage.removeItem("currentUser"); // యూజర్ వివరాలను క్లియర్ చేస్తుంది
  setLoggedIn(false); // లాగిన్ స్టేట్ ని తీసేస్తుంది
  setTasks([]); // అప్పటివరకు ఉన్న టాస్క్ లిస్ట్ ని ఖాళీ చేస్తుంది
};
     

  // FILTER + SEARCH
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchesSearch =
        t.text
          .toLowerCase()
          .includes(search.toLowerCase());

      if (filter === "Completed") {
        return (
          matchesSearch && t.completed
        );
      }

      if (filter === "Pending") {
        return (
          matchesSearch && !t.completed
        );
      }

      if (filter === "High") {
        return (
          matchesSearch &&
          t.priority === "High"
        );
      }

      return matchesSearch;
    });
  }, [tasks, search, filter]);

  // STATS
  const completedCount = tasks.filter(
    (t) => t.completed
  ).length;

  const pendingCount = tasks.filter(
    (t) => !t.completed
  ).length;

  const completionPercentage =
    tasks.length === 0
      ? 0
      : Math.round(
          (completedCount / tasks.length) *
            100
        );
       // LOGIN SCREEN
   if (!loggedIn) {
     return (
    <div style={loginPage}>
      <div style={loginCard}>
        <h1 style={{ fontSize: "36px" }}>
          {showSignup ? "📝 Sign Up" : "🔐 Login"}
        </h1>

        <p style={{ color: "#bbb" }}>Welcome to Task Manager</p>

        {/* Signup Name Input */}
        {showSignup && (
          <input
            type="text"
            placeholder="Full Name"
            value={signupName}
            onChange={(e) => setSignupName(e.target.value)}
            style={inputStyle}
          />
        )}

        {/* Username Input (Dynamic based on mode) */}
        <input
          type="text"
          placeholder="Username"
          value={showSignup ? signupUser : username}
          onChange={(e) => 
            showSignup ? setSignupUser(e.target.value) : setUsername(e.target.value)
          }
          style={inputStyle}
        />

        {/* Password Input (Dynamic based on mode) */}
        <input
          type="password"
          placeholder="Password"
          value={showSignup ? signupPass : password}
          onChange={(e) => 
            showSignup ? setSignupPass(e.target.value) : setPassword(e.target.value)
          }
          style={inputStyle}
        />

        {/* Unified Login/Signup Button */}
        <button
          style={loginButton}
          onClick={showSignup ? handleSignup : handleLogin}
        >
          {showSignup ? "Create Account" : "Login"}
        </button>

        {/* Toggle between Login and Signup */}
        <button
          style={switchButton}
          onClick={() => setShowSignup(!showSignup)}
        >
          {showSignup ? "Already have account? Login" : "Create new account"}
        </button>
      </div>
    </div>
  );
}
  // MAIN UI
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "20px",
        fontFamily: "Arial",
        background: darkMode
          ? "#0f172a"
          : "linear-gradient(135deg,#dbeafe,#f5d0fe,#e0e7ff)",
        color: darkMode
          ? "white"
          : "black",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "auto",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "25px",
          }}
        >
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              background:
                "linear-gradient(to right,#4f46e5,#ec4899)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor:
                "transparent",
              lineHeight: "1.5",
            }}
          >
            Task Management Application
          </h1>

          <p>
            Organize your tasks and boost
            productivity 🚀
          </p>
        </div>

        {/* TOP BUTTONS */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "15px",
            flexWrap: "wrap",
            marginBottom: "25px",
          }}
        >
          <button
            style={topButton}
            onClick={() =>
              setDarkMode(!darkMode)
            }
          >
            {darkMode
              ? "☀ Light Mode"
              : "🌙 Dark Mode"}
          </button>

          <button
            style={{
              ...topButton,
              background: "#ef4444",
            }}
            onClick={() =>
              setLoggedIn(false)
            }
          >
            Logout
          </button>
        </div>

        {/* ADD TASK CARD */}
        <div style={card}>
          <h2>✨ Add New Task</h2>

          <div style={flexWrap}>
            <input
              type="text"
              placeholder="Enter your task..."
              value={task}
              onChange={(e) =>
                setTask(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addTask();
                }
              }}
              style={taskInput}
            />

            {/* PRIORITY */}
            <select
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value)
              }
              style={selectStyle}
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>

            {/* CATEGORY */}
            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              style={selectStyle}
            >
              <option>Study</option>
              <option>Work</option>
              <option>Health</option>
              <option>Personal</option>
            </select>

            {/* DUE DATE */}
            <input
              type="date"
              value={dueDate}
              onChange={(e) =>
                setDueDate(e.target.value)
              }
              style={selectStyle}
            />

            <button
              onClick={addTask}
              style={addButton}
            >
              + Add Task
            </button>
          </div>

          {/* SEARCH */}
          <input
            type="text"
            placeholder="🔍 Search tasks..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            style={{
              ...taskInput,
              marginTop: "20px",
            }}
          />

          {/* FILTERS */}
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            {[
              "All",
              "Completed",
              "Pending",
              "High",
            ].map((item) => (
              <button
                key={item}
                onClick={() =>
                  setFilter(item)
                }
                style={{
                  ...filterButton,
                  background:
                    filter === item
                      ? "#7c3aed"
                      : "#ddd",
                  color:
                    filter === item
                      ? "white"
                      : "black",
                }}
              >
                {item}
              </button>
            ))}
          </div>

          {/* PROGRESS */}
          <div
            style={{
              marginTop: "30px",
            }}
          >
            <h3>
              📊 Progress:{" "}
              {completionPercentage}%
            </h3>

            <div
              style={{
                width: "100%",
                height: "18px",
                background: "#ddd",
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${completionPercentage}%`,
                  height: "100%",
                  background:
                    "linear-gradient(to right,#22c55e,#16a34a)",
                }}
              ></div>
            </div>
          </div>

          {/* STATS */}
          <div style={statsContainer}>
            <div style={statCard("#dbeafe")}>
              <h3>Total</h3>
              <h1>{tasks.length}</h1>
            </div>

            <div style={statCard("#dcfce7")}>
              <h3>Completed</h3>
              <h1>{completedCount}</h1>
            </div>

            <div style={statCard("#fee2e2")}>
              <h3>Pending</h3>
              <h1>{pendingCount}</h1>
            </div>
          </div>
        </div>

        {/* TASK LIST */}
        <div
          style={{
            ...card,
            marginTop: "35px",
          }}
        >
          <h2>📋 Your Tasks</h2>

          {filteredTasks.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px",
              }}
            >
              <h1 style={{ fontSize: "70px" }}>
                📝
              </h1>

              <h2>No tasks found</h2>

              <p>
                Add tasks to get started 🚀
              </p>
            </div>
          ) : (
            filteredTasks.map(
              (t, index) => (
                <div
                  key={index}
                  style={{
                    background:
                      t.completed
                        ? "#dcfce7"
                        : darkMode
                        ? "#1e293b"
                        : "#f5f3ff",

                    padding: "20px",
                    borderRadius: "18px",
                    marginBottom: "18px",

                    display: "flex",
                    justifyContent:
                      "space-between",

                    alignItems: "center",

                    flexWrap: "wrap",

                    gap: "15px",

                    transition: "0.3s",
                  }}
                >
                  {/* LEFT */}
                  <div>
                    <h3
                      style={{
                        textDecoration:
                          t.completed
                            ? "line-through"
                            : "none",
                      }}
                    >
                      {t.completed
                        ? "✅"
                        : "📌"}{" "}
                      {t.text}
                    </h3>

                    {/* CATEGORY */}
                    <p>
                      📂 Category:{" "}
                      {t.category}
                    </p>

                    {/* PRIORITY */}
                    <p
                      style={{
                        color:
                          t.priority ===
                          "High"
                            ? "red"
                            : t.priority ===
                              "Medium"
                            ? "orange"
                            : "green",
                      }}
                    >
                      🔥 Priority:{" "}
                      {t.priority}
                    </p>

                    {/* DUE */}
                    <p>
                      📅 Due: {t.due}
                    </p>

                    {/* OVERDUE */}
                    {new Date(t.due) <
                      new Date() &&
                      !t.completed && (
                        <p
                          style={{
                            color: "red",
                            fontWeight:
                              "bold",
                          }}
                        >
                          ⚠ Overdue Task
                        </p>
                      )}
                  </div>

                  {/* BUTTONS */}
                  <div>
                    <button
                      onClick={() =>
                        completeTask(index)
                      }
                      style={{
                        ...actionButton,
                        background:
                          "#22c55e",
                      }}
                    >
                      {t.completed
                        ? "Undo"
                        : "Complete"}
                    </button>

                    <button
                      onClick={() =>
                        editTask(index)
                      }
                      style={{
                        ...actionButton,
                        background:
                          "#3b82f6",
                      }}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        deleteTask(index)
                    }
                      style={{
                        ...actionButton,
                        background:
                          "#ef4444",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )
            )
          )}
        </div>

        {/* FOOTER */}
        <p
          style={{
            textAlign: "center",
            marginTop: "25px",
            color: darkMode
              ? "#ccc"
              : "#555",
          }}
        >
          © 2026 Task Management
          Application | Built with React
          🚀
        </p>
      </div>
    </div>
  );
}

// STYLES

const loginPage = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background:
    "linear-gradient(135deg,#141E30,#243B55)",
  padding: "20px",
};

const loginCard = {
  background: "#1e293b",
  padding: "40px",
  borderRadius: "25px",
  width: "350px",
  textAlign: "center",
  color: "white",
  boxShadow:
    "0 10px 30px rgba(0,0,0,0.5)",
};

const inputStyle = {
  width: "100%",
  padding: "14px",
  marginTop: "15px",
  borderRadius: "12px",
  border: "none",
  fontSize: "16px",
};

const loginButton = {
  width: "100%",
  padding: "14px",
  marginTop: "20px",
  borderRadius: "12px",
  border: "none",
  background: "#6366f1",
  color: "white",
  fontSize: "17px",
  fontWeight: "bold",
  cursor: "pointer",
};

const switchButton = {
  marginTop: "15px",
  background: "transparent",
  border: "none",
  color: "#60a5fa",
  cursor: "pointer",
};

const card = {
  background: "white",
  padding: "30px",
  borderRadius: "25px",
  boxShadow:
    "0 10px 30px rgba(0,0,0,0.1)",
};

const flexWrap = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
};

const taskInput = {
  flex: 1,
  padding: "18px",
  borderRadius: "14px",
  border: "2px solid #c084fc",
  fontSize: "16px",
  outline: "none",
};

const selectStyle = {
  padding: "18px",
  borderRadius: "14px",
  border: "2px solid #c084fc",
  fontSize: "15px",
};

const addButton = {
  background:
    "linear-gradient(to right,#7c3aed,#ec4899)",
  color: "white",
  border: "none",
  padding: "18px 30px",
  borderRadius: "14px",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer",
};

const topButton = {
  background: "#6366f1",
  color: "white",
  border: "none",
  padding: "12px 20px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "bold",
};

const actionButton = {
  color: "white",
  border: "none",
  padding: "10px 14px",
  borderRadius: "10px",
  marginRight: "10px",
  cursor: "pointer",
};

const filterButton = {
  border: "none",
  padding: "10px 18px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
};

const statsContainer = {
  display: "flex",
  justifyContent: "space-around",
  gap: "15px",
  marginTop: "30px",
  flexWrap: "wrap",
};

const statCard = (bg) => ({
  background: bg,
  padding: "20px",
  borderRadius: "20px",
  width: "220px",
  textAlign: "center",
});

export default App;