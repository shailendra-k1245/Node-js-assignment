import { useState } from "react";

export const Register = () => {
  const [data, setData] = useState({
    id: "",
    first_name: "",
    last_name: "",
    email: "",
    contact: "",
    password: "",
    picture: "",
    tasks: [],
  });
  const {taskData,setTaskData} = useState()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      [name]: value,
    });
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter id"
        onChange={handleChange}
        name="id"
      />
      <input
        type="text"
        placeholder="Enter firstname"
        onChange={handleChange}
        name="first_name"
      />
      <input
        type="text"
        placeholder="Enter lastname"
        onChange={handleChange}
        name="last_name"
      />
      <input
        type="text"
        placeholder="Enter email"
        onChange={handleChange}
        name="email"
      />
      <input
        type="Number"
        placeholder="Enter contact"
        onChange={handleChange}
        name="contact"
      />
      <input
        type="text"
        placeholder="Enter password"
        onChange={handleChange}
        name="password"
      />
      <input
        type="text"
        placeholder="Enter pic url"
        onChange={handleChange}
        name="picture"
      />
      <input type="text" placeholder="Enter tasks" name="tasks" />
      <button>Register</button>
    </div>
  );
};
