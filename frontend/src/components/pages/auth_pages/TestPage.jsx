import React, { useEffect, useState } from "react";
import isEmail from "validator/lib/isEmail";
function TestPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const[style,setStyle]=useState('');
  //
  
  useEffect(() => {
    if (isEmail(email)) {
        
        
       setStyle ("border-green-500 text-green-800");
    }
    else{
        setStyle("")
    }
    
    
  }, [email]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", { name, email, message });
  };

  return (
    <div>
      {" "}
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 ${style} leading-tight focus:outline-none focus:shadow-outline`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="message"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Message
          </label>
          <textarea
            id="message"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows="5"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default TestPage;
