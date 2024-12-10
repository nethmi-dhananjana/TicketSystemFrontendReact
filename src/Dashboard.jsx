/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import useWebSocket from 'react-use-websocket';

const Dashboard = () => {
  // State for logging and ticket counts
  const [logData, setLogData] = useState([]);
  const [vendorTickets, setVendorTickets] = useState(0);
  const [purchasedTickets, setPurchasedTickets] = useState(0);
  const [availableTickets, setAvailableTickets] = useState(0);
  
  // State for configuration form
  const [config, setConfig] = useState({
    totalTickets: 0,
    ticketReleaseRate: 0,
    customerRetrievalRate: 0,
    maxTicketCapacity: 0,
  });

  // WebSocket hook
  const { sendMessage} = useWebSocket('ws://localhost:8080/webSocket', {
    onOpen: () => console.log('WebSocket connection established'),
    onClose: () => console.log('WebSocket connection closed'),
    onError: (error) => console.error('WebSocket error:', error),
    onMessage: (message) => {
      const data = message.data;
      setLogData((prev) => [...prev, { id: prev.length + 1, message: data }]);

      // Update ticket data based on message
      if (data.includes('Vendor added')) {
        const ticketsAdded = data.match(/Vendor added (\d+)/);
        if (ticketsAdded) {
          const tickets = parseInt(ticketsAdded[1]);
          setVendorTickets((prev) => prev + tickets);
          setAvailableTickets((prev) => prev + tickets);
        }
      } else if (data.includes('Customer retrieved')) {
        const ticketsRetrieved = data.match(/Customer retrieved (\d+)/);
        if (ticketsRetrieved) {
          const tickets = parseInt(ticketsRetrieved[1]);
          setPurchasedTickets((prev) => prev + tickets);
          setAvailableTickets((prev) => prev - tickets);
        }
      }
    },
  });

  // Handle configuration form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig((prevConfig) => ({ ...prevConfig, [name]: value }));
  };

  // Handle form submit (for updating configuration)
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Configuration updated:', config);

    // Assuming the backend takes care of ticket updates based on the form data
    setAvailableTickets(config.totalTickets);
    setVendorTickets(0); // Reset after form submission if necessary
    setPurchasedTickets(0); // Reset purchased tickets if needed
  };

  // Handle the start and stop actions
//   const handleStart = () => {

//     fetch('http://localhost:8080/api/configuration/start-vendor', { method: 'POST' })
//     .then(response => {
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       return response.json();
//     })
//     .then(data => console.log('Start vendor response:', data))
//     .catch(error => console.error('Failed to fetch:', error));
  
//   fetch('http://localhost:8080/api/configuration/start-customer', { method: 'POST' })
//     .then(response => {
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       return response.json();
//     })
//     .then(data => console.log('Start customer response:', data))
//     .catch(error => console.error('Failed to fetch:', error));
// };



const handleStart = () => {
  fetch('http://localhost:8080/api/configuration/start', {

    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(config),
    
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to start simulations');
      }
      return response.text();
    })
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
};


const handleStop = () => {
  fetch('http://localhost:8080/api/configuration/stop', { method: 'POST' })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to stop simulations');
      }
      return response.text();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => console.error('Error:', error));
};




  // const handleStop = () => {
  //   sendMessage('stop'); // Optionally send a stop message to the backend
  // };

  return (
    <div className="dashboard-container">
      <div className="form-section">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRf66_34Nt6-wVsI67rk7n1cx8ng-7f5Jm2KU75j08EQ-Nn_SVwIbDi3YCUQ5FBax2peNA&usqp=CAU"
          alt="Configuration Form"
          className="config-image"
        />
        <h2>Configuration Form</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Total Tickets</label>
            <input
              type="number"
              name="totalTickets"
              value={config.totalTickets}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Ticket Release Rate</label>
            <input
              type="number"
              name="ticketReleaseRate"
              value={config.ticketReleaseRate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Customer Retrieval Rate</label>
            <input
              type="number"
              name="customerRetrievalRate"
              value={config.customerRetrievalRate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Max Ticket Capacity</label>
            <input
              type="number"
              name="maxTicketCapacity"
              value={config.maxTicketCapacity}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Update Configuration</button>
        </form>
      </div>

      <div className="display-section">
        {/* Vendor Circle with Button */}
        <div className="circle interactive-circle">
          <h3>Vendor</h3>
          <p>{vendorTickets} Tickets Added</p>
          <button className="circle-button">Add Tickets</button>
        </div>

        {/* Purchased Tickets Circle with Button */}
        <div className="circle interactive-circle">
          <h3>Purchased</h3>
          <p>{purchasedTickets} Tickets</p>
          <button className="circle-button">Purchase Ticket</button>
        </div>

        {/* Available Tickets Circle with Button */}
        <div className="circle interactive-circle">
          <h3>Available</h3>
          <p>{availableTickets} Tickets</p>
          <button className="circle-button">Check Availability</button>
        </div>

         {/* Start/Stop Buttons */}
        <div className="control-buttons">
          <button onClick={handleStart}>Start</button>
          <button onClick={handleStop}>Stop</button>
        </div>

       

        {/* Log Table for Thread Output */}
        <div className="log-table">
          <h3>Thread Output Log</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {logData.map((log) => (
                <tr key={log.id}>
                  <td>{log.id}</td>
                  <td>{log.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
