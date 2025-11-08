import React, { useState, useEffect, useRef } from 'react';
import { fetchStudents as fetchStudentsAPI } from '../../registration/api';

const RoomGrid = ({ isDarkMode, selectedFloor }) => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const modalRef = useRef(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchStudentsAPI();
      setStudents(data);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError(err.message);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const generateRooms = () => {
    const roomMap = new Map();

    const blockConfig = [
      { letter: 'A', start: 101, count: 40 },
      { letter: 'B', start: 201, count: 52 },
      { letter: 'C', start: 301, count: 52 },
      { letter: 'D', start: 401, count: 52 }
    ];

    blockConfig.forEach(({ letter, start, count }) => {
      const endRoom = start + count - 1;

      let floor;
      switch (letter) {
        case 'A': floor = 'ground'; break;
        case 'B': floor = 'first'; break;
        case 'C': floor = 'second'; break;
        case 'D': floor = 'third'; break;
        default: floor = 'ground';
      }

      for (let roomNum = start; roomNum <= endRoom; roomNum++) {
        roomMap.set(roomNum, {
          id: roomNum,
          block: letter,
          floor: floor,
          status: 'available',
          students: [],
          type: 'Shared'
        });
      }
    });

    students.forEach(student => {
      if (student.room_number && String(student.room_number).trim() !== '') {
        const roomNum = parseInt(student.room_number);
        if (roomMap.has(roomNum)) {
          const room = roomMap.get(roomNum);
          room.students.push(student.name);
          room.status = 'occupied';
          roomMap.set(roomNum, room);
        }
      }
    });

    return Array.from(roomMap.values());
  };

  const rooms = generateRooms();

  const filteredRooms = selectedFloor === 'all'
    ? rooms
    : rooms.filter(room => room.floor === selectedFloor);

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-300 text-green-800 shadow-green-100 shadow-sm';
      case 'occupied':
        return 'bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-300 text-blue-800 shadow-blue-100 shadow-sm';
      case 'maintenance':
        return 'bg-gradient-to-br from-yellow-50 to-orange-100 border-yellow-300 text-yellow-800 shadow-yellow-100 shadow-sm';
      default:
        return 'bg-gradient-to-br from-gray-50 to-slate-100 border-gray-300 text-gray-800 shadow-gray-100 shadow-sm';
    }
  };

  const handleRoomClick = (room, event) => {
    setSelectedRoom(room);

    // Get the click position
    const clickX = event.clientX;
    const clickY = event.clientY;

    // Set initial position to click coordinates
    setModalPosition({
      top: clickY,
      left: clickX
    });

    setShowModal(true);
  };

  // Adjust modal position after it renders
  useEffect(() => {
    if (showModal && modalRef.current) {
      const modal = modalRef.current;
      const modalWidth = modal.offsetWidth;
      const modalHeight = modal.offsetHeight;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let newLeft = modalPosition.left - modalWidth / 2;
      let newTop = modalPosition.top - modalHeight / 2;

      // Ensure modal stays within viewport
      if (newLeft < 20) newLeft = 20;
      if (newTop < 20) newTop = 20;
      if (newLeft + modalWidth > viewportWidth - 20) {
        newLeft = viewportWidth - modalWidth - 20;
      }
      if (newTop + modalHeight > viewportHeight - 20) {
        newTop = viewportHeight - modalHeight - 20;
      }

      // Only update if position needs to change
      if (newLeft !== modalPosition.left || newTop !== modalPosition.top) {
        setModalPosition({ top: newTop, left: newLeft });
      }
    }
  }, [showModal]);

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRoom(null);
  };

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        handleCloseModal();
      }
    };

    if (showModal) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  // Group rooms by blocks
  const roomsByBlock = filteredRooms.reduce((acc, room) => {
    if (!acc[room.block]) {
      acc[room.block] = [];
    }
    acc[room.block].push(room);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Loading rooms...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 rounded-md ${isDarkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-700'}`}>
        <p>Error loading rooms: {error}</p>
        <button
          onClick={fetchStudents}
          className={`mt-2 px-4 py-2 rounded border ${
            isDarkMode 
              ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
              : 'border-gray-300 text-gray-700 hover:bg-gray-100'
          }`}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'} p-6 rounded-xl`}>
      {Object.keys(roomsByBlock).sort().map(block => (
        <div key={block} className="space-y-4">
          <div className={`flex items-center space-x-3 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-sm`}>
            <div className={`w-4 h-4 rounded-full ${
              block === 'A' ? 'bg-green-500' :
              block === 'B' ? 'bg-blue-500' :
              block === 'C' ? 'bg-purple-500' : 'bg-orange-500'
            }`}></div>
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Block {block}
            </h3>
            <span className={`text-sm px-2 py-1 rounded-full ${
              isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
            }`}>
              {roomsByBlock[block].length} rooms
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {roomsByBlock[block].map((room) => (
              <div
                key={room.id}
                className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 transform ${
                  getStatusColor(room.status)
                } ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-white'}`}
                onClick={(event) => handleRoomClick(room, event)}
              >
                <div className="text-center">
                  <div className="text-lg font-bold">Room {room.id}</div>
                  <div className="text-xs capitalize mt-1">{room.status}</div>
                  {room.students && room.students.length > 0 ? (
                    <div className="text-xs mt-2">
                      {room.students.length === 1 ? (
                        <div className="truncate" title={room.students[0]}>
                          {room.students[0]}
                        </div>
                      ) : (
                        <div className="text-blue-600 font-medium">
                          {room.students.length} students
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs mt-2 text-gray-500">
                      Empty
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Room Details Modal */}
      {showModal && selectedRoom && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-40 transition-opacity duration-300"
            onClick={handleCloseModal}
          ></div>
          
          {/* Modal */}
          <div
            ref={modalRef}
            className={`fixed p-6 rounded-2xl shadow-2xl max-w-md w-full z-50 transform transition-all duration-300 ${
              isDarkMode
                ? 'bg-gray-800 border border-gray-700'
                : 'bg-white border border-gray-200'
            }`}
            style={{
              top: `${modalPosition.top}px`,
              left: `${modalPosition.left}px`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  selectedRoom.block === 'A' ? 'bg-green-500' :
                  selectedRoom.block === 'B' ? 'bg-blue-500' :
                  selectedRoom.block === 'C' ? 'bg-purple-500' : 'bg-orange-500'
                }`}></div>
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Room {selectedRoom.id} Details
                </h3>
              </div>
              <button
                onClick={handleCloseModal}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 ${
                  isDarkMode
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                ✕
              </button>
            </div>
            <div className="space-y-5">
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Status</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                    selectedRoom.status === 'occupied'
                      ? 'bg-green-100 text-green-800'
                      : selectedRoom.status === 'available'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedRoom.status}
                  </span>
                </div>
              </div>

              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Type</span>
                  <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedRoom.type}
                  </span>
                </div>
              </div>

              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Floor</span>
                  <span className={`text-sm font-semibold capitalize ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedRoom.floor}
                  </span>
                </div>
              </div>

              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Students</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    selectedRoom.students && selectedRoom.students.length > 0
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {selectedRoom.students ? selectedRoom.students.length : 0} assigned
                  </span>
                </div>
                {selectedRoom.students && selectedRoom.students.length > 0 ? (
                  <div className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedRoom.students.length === 1 ? (
                      <div className="font-medium">{selectedRoom.students[0]}</div>
                    ) : (
                      <div>
                        <div className="font-medium mb-2">{selectedRoom.students.length} students:</div>
                        <div className="space-y-1">
                          {selectedRoom.students.map((student, index) => (
                            <div key={index} className={`flex items-center space-x-2 p-2 rounded ${
                              isDarkMode ? 'bg-gray-600' : 'bg-white'
                            }`}>
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span className="text-sm">{student}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className={`text-sm italic ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    No students assigned
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RoomGrid;