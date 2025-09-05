import React, { useState } from 'react';
import Button from '../Common/Button';

const RoomGrid = ({ isDarkMode, selectedFloor }) => {
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Mock data - replace with actual data from API
  const rooms = [
    { id: 101, floor: 'ground', status: 'occupied', student: 'John Doe', type: 'Single' },
    { id: 102, floor: 'ground', status: 'available', student: null, type: 'Single' },
    { id: 103, floor: 'ground', status: 'maintenance', student: null, type: 'Single' },
    { id: 104, floor: 'ground', status: 'occupied', student: 'Jane Smith', type: 'Single' },
    { id: 105, floor: 'ground', status: 'available', student: null, type: 'Single' },
    { id: 201, floor: 'first', status: 'occupied', student: 'Bob Johnson', type: 'Double' },
    { id: 202, floor: 'first', status: 'occupied', student: 'Alice Brown', type: 'Double' },
    { id: 203, floor: 'first', status: 'available', student: null, type: 'Double' },
    { id: 204, floor: 'first', status: 'maintenance', student: null, type: 'Double' },
    { id: 205, floor: 'first', status: 'occupied', student: 'Charlie Wilson', type: 'Double' },
  ];

  const filteredRooms = selectedFloor === 'all'
    ? rooms
    : rooms.filter(room => room.floor === selectedFloor);

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 border-green-200 text-green-800';
      case 'occupied':
        return 'bg-blue-100 border-blue-200 text-blue-800';
      case 'maintenance':
        return 'bg-yellow-100 border-yellow-200 text-yellow-800';
      default:
        return 'bg-gray-100 border-gray-200 text-gray-800';
    }
  };

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
  };

  const handleAssignStudent = (roomId) => {
    console.log('Assign student to room:', roomId);
  };

  const handleMaintenance = (roomId) => {
    console.log('Mark room for maintenance:', roomId);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredRooms.map((room) => (
          <div
            key={room.id}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
              getStatusColor(room.status)
            } ${selectedRoom?.id === room.id ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => handleRoomClick(room)}
          >
            <div className="text-center">
              <div className="text-lg font-bold">{room.id}</div>
              <div className="text-xs capitalize">{room.status}</div>
              <div className="text-xs mt-1">{room.type}</div>
              {room.student && (
                <div className="text-xs mt-1 truncate" title={room.student}>
                  {room.student}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedRoom && (
        <div className={`mt-6 p-4 border rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
          <h4 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Room {selectedRoom.id} Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Status</p>
              <p className={`text-sm font-medium capitalize ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {selectedRoom.status}
              </p>
            </div>
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Type</p>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {selectedRoom.type}
              </p>
            </div>
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Floor</p>
              <p className={`text-sm font-medium capitalize ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {selectedRoom.floor}
              </p>
            </div>
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Student</p>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {selectedRoom.student || 'Not assigned'}
              </p>
            </div>
          </div>
          <div className="flex space-x-2 mt-4">
            {selectedRoom.status === 'available' && (
              <Button
                onClick={() => handleAssignStudent(selectedRoom.id)}
                variant="primary"
                size="small"
                isDarkMode={isDarkMode}
              >
                Assign Student
              </Button>
            )}
            <Button
              onClick={() => handleMaintenance(selectedRoom.id)}
              variant="outline"
              size="small"
              isDarkMode={isDarkMode}
            >
              Maintenance
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomGrid;
