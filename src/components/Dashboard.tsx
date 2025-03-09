import DashboardMap from "./DashboardMap";
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FileText, Clock, LogOut, XCircle, MapPin } from 'lucide-react';
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
  const [closedEvents, setClosedEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeEventsModalOpen, setActiveEventsModalOpen] = useState(false);
  const [closedEventsModalOpen, setClosedEventsModalOpen] = useState(false);

  useEffect(() => {
    const fetchActiveEvents = async () => {
      if (!activeEventsModalOpen || !user) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(process.env.API_URL);
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

  const closeEvent = (event: Event) => {
    setActiveEvents(prev => prev.filter(e => e.id !== event.id));
    setClosedEvents(prev => [
      ...prev,
      {
        ...event,
        status: 'Closed',
        timestamp: new Date().toLocaleString(),
        title: event.title || "No Title",
        location: event.location || event.address || "No Location",
      }
    ]);
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-64 bg-slate-800 text-white p-6">
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-2">{user?.toUpperCase() || "Guest"}</h2>
          <div className="h-0.5 bg-white/20"></div>
        </div>
        <nav className="space-y-4">
          <button onClick={() => setActiveEventsModalOpen(true)} className="flex items-center space-x-3 w-full p-3 rounded hover:bg-slate-700 transition">
            <Clock className="w-5 h-5" />
            <span>Active Events</span>
          </button>
          <button onClick={() => setClosedEventsModalOpen(true)} className="flex items-center space-x-3 w-full p-3 rounded hover:bg-slate-700 transition">
            <Clock className="w-5 h-5" />
            <span>Closed Events</span>
          </button>
          <button onClick={() => logout()} className="flex items-center space-x-3 w-full p-3 bg-red-600 rounded hover:bg-red-700 transition mt-8">
            <LogOut className="w-5 h-5" />
            <span>LOGOUT</span>
          </button>
        </nav>
      </div>
      <div className="flex-1 p-8">
  <DashboardMap />
</div>
      
      <Modal isOpen={activeEventsModalOpen} onClose={() => setActiveEventsModalOpen(false)} title="Active Events">
        <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-6">
          <div className="max-h-96 overflow-y-auto space-y-4 p-2">
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
                  <button onClick={() => closeEvent(event)} className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-sm">Close Event</button>
                </div>
              ))
            )}
          </div>
        </div>
      </Modal>
      <Modal isOpen={closedEventsModalOpen} onClose={() => setClosedEventsModalOpen(false)} title="Closed Events">
        <div className="space-y-4 max-h-96 overflow-y-auto p-2">
          {closedEvents.length === 0 ? (
            <p className="text-center text-gray-500">No closed events.</p>
          ) : (
            closedEvents.map(event => (
              <div key={event.id} className="bg-gray-100 p-4 rounded-lg shadow-md border-l-4 border-gray-500">
              <h3 className="font-semibold text-lg text-gray-800">Event Id:{event.id || "No Title"}</h3>
              <p className="text-sm text-gray-700">📍 {event.location || "No Location"}</p>
              <p className="text-xs text-gray-600">Closed on: {event.timestamp}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-gray-300 text-gray-800 rounded-full text-xs font-semibold">
                {event.status}
              </span>
            </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
