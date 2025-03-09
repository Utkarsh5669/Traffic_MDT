import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FileText, Clock, LogOut } from 'lucide-react';
import Modal from './Modal';

interface Event {
  id: number;
  address: string;
  latitude: number;
  longitude: number;
  incident_description: string;
  caller_name: string;
  caller_number: string;
  mdt_number: string;
  category: string;
  event_type: string;
  priority: string;
  created_at: string;
  title: string;
  location: string;
  status: string;
  timestamp: string;
}

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeEvents, setActiveEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeEventsModalOpen, setActiveEventsModalOpen] = useState(false);
  const [closedEventsModalOpen, setClosedEventsModalOpen] = useState(false);

  const handleEChallanRedirect = () => {
    window.open("https://echallan.parivahan.gov.in/", "_blank");
  };


  useEffect(() => {
    const fetchActiveEvents = async () => {
      if (!activeEventsModalOpen || !user) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("process.env.API_URL");
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        setActiveEvents(data.events);
      } catch (err) {
        console.error("Fetch error:", err);
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActiveEvents();
  }, [activeEventsModalOpen, user]);

  const closedEvents: Event[] = [
    {
      id: 3,
      title: "Speed Limit Violation",
      location: "Sector 35, Chandigarh",
      status: "Closed",
      timestamp: "2024-03-06 09:15"
    },
    {
      id: 4,
      title: "Parking Violation",
      location: "Sector 8, Chandigarh",
      status: "Closed",
      timestamp: "2024-03-06 11:30"
    }
  ];

  return (
    <div className="min-h-screen flex">
      <div className="w-64 bg-slate-800 text-white p-6">
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-2">{user?.toUpperCase() || "Guest"}</h2>
          <div className="h-0.5 bg-white/20"></div>
        </div>
        <nav className="space-y-4">
          <button onClick={handleEChallanRedirect} className="flex items-center space-x-3 w-full p-3 rounded hover:bg-slate-700 transition">
            <FileText className="w-5 h-5" />
            <span>Generate E-challan</span>
          </button>
           <button 
            onClick={() => setClosedEventsModalOpen(true)}
            className="flex items-center space-x-3 w-full p-3 rounded hover:bg-slate-700 transition"
          >
            <Clock className="w-5 h-5" />
            <span>Closed Events</span>
          </button>
          <button onClick={() => setActiveEventsModalOpen(true)} className="flex items-center space-x-3 w-full p-3 rounded hover:bg-slate-700 transition">
            <Clock className="w-5 h-5" />
            <span>Active Events</span>
          </button>
          <button onClick={() => logout()} className="flex items-center space-x-3 w-full p-3 bg-red-600 rounded hover:bg-red-700 transition mt-8">
            <LogOut className="w-5 h-5" />
            <span>LOGOUT</span>
          </button>
        </nav>
      </div>
      <div className="flex-1 p-8">
        <div className="w-full h-[calc(100vh-4rem)] rounded-lg overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d109744.05905969579!2d76.68831226889642!3d30.732925576749!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390fed0be66ec96b%3A0xa5ff67f9527319fe!2sChandigarh!5e0!3m2!1sen!2sin!4v1708697436040!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
      <Modal isOpen={activeEventsModalOpen} onClose={() => setActiveEventsModalOpen(false)} title="Active Events">
  <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-6 relative">
    <div className="max-h-96 overflow-y-auto space-y-4 p-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
      {isLoading ? (
        <p className="text-center text-gray-600 font-medium">Loading events...</p>
      ) : error ? (
        <p className="text-center text-red-500 font-medium">{error}</p>
      ) : activeEvents.length === 0 ? (
        <p className="text-center text-gray-500">No active events found.</p>
      ) : (
        activeEvents.map(event => (
          <div key={event.id} className="bg-gray-100 p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
            <h3 className="font-semibold text-lg text-blue-600">{event.category}</h3>
            <p className="text-sm text-gray-700">{event.incident_description}</p>
            <p className="text-sm text-gray-700 font-medium">📍 {event.address}</p>
            <p className="text-sm text-gray-700 font-semibold">
              🔥 Priority: 
              <span className={`ml-1 px-2 py-1 rounded-full text-xs font-semibold ${event.priority === "High Priority" ? "bg-red-500 text-white" : event.priority === "Medium Priority" ? "bg-yellow-400 text-black" : "bg-green-500 text-white"}`}>
                {event.priority}
              </span>
            </p>
            <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
              {event.event_type}
            </span>
          </div>
        ))
      )}
    </div>
  </div>
</Modal>

      //       {/* Closed Events Modal */}
      <Modal
        isOpen={closedEventsModalOpen}
        onClose={() => setClosedEventsModalOpen(false)}
        title="Closed Events"
      >
        <div className="space-y-4">
          {closedEvents.map(event => (
            <div key={event.id} className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg">{event.title}</h3>
              <div className="text-sm text-gray-600 mt-1">
                <p>Location: {event.location}</p>
                <p>Time: {event.timestamp}</p>
                <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">
                  {event.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
