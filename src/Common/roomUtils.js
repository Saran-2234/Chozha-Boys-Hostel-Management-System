// Room number utility functions

/**
 * Extracts room information from student data
 * @param {Object} studentData - Student data object
 * @returns {Object} Room information with number, block, and floor
 */
export const getRoomInfo = (studentData) => {
  if (!studentData) return { roomNumber: 'N/A', block: 'N/A', floor: 'N/A' };
  
  let roomNumber = 'N/A';
  
  // Handle different possible structures of studentData
  if (studentData.data && studentData.data.room_number) {
    roomNumber = studentData.data.room_number;
  } else if (studentData.room_number) {
    roomNumber = studentData.room_number;
  } else if (studentData.userdata && studentData.userdata.length > 0 && studentData.userdata[0].room_number) {
    roomNumber = studentData.userdata[0].room_number;
  }
  
  return parseRoomNumber(roomNumber);
};

/**
 * Parses a room number to extract block and floor information
 * @param {string|number} roomNumber - The room number to parse
 * @returns {Object} Room information with number, block, and floor
 */
export const parseRoomNumber = (roomNumber) => {
  if (!roomNumber || roomNumber === 'N/A') {
    return { roomNumber: 'N/A', block: 'N/A', floor: 'N/A' };
  }
  
  const roomStr = roomNumber.toString();
  let block = 'N/A';
  let floor = 'N/A';
  
  // Extract block from room number (assume first character if letter)
  if (roomStr.length > 0) {
    const firstChar = roomStr.charAt(0);
    if (/[A-Za-z]/.test(firstChar)) {
      block = `Block ${firstChar.toUpperCase()}`;
    } else {
      // If no letter, try to determine block based on room number range
      const roomNum = parseInt(roomStr);
      if (!isNaN(roomNum)) {
        if (roomNum >= 100 && roomNum <= 199) block = 'Block A';
        else if (roomNum >= 200 && roomNum <= 299) block = 'Block B';
        else if (roomNum >= 300 && roomNum <= 399) block = 'Block C';
        else if (roomNum >= 400 && roomNum <= 499) block = 'Block D';
        else block = 'Block A'; // Default
      } else {
        block = 'Block A'; // Default
      }
    }
  }
  
  // Extract floor from room number
  if (roomStr.length >= 3) {
    const roomNum = parseInt(roomStr);
    if (!isNaN(roomNum)) {
      if (roomNum >= 100 && roomNum <= 199) {
        floor = 'Ground Floor';
      } else if (roomNum >= 200 && roomNum <= 299) {
        floor = '1st Floor';
      } else if (roomNum >= 300 && roomNum <= 399) {
        floor = '2nd Floor';
      } else if (roomNum >= 400 && roomNum <= 499) {
        floor = '3rd Floor';
      } else {
        floor = 'N/A';
      }
    }
  }
  
  return { roomNumber: roomStr, block, floor };
};

/**
 * Gets the floor name from a room number
 * @param {string|number} roomNumber - The room number
 * @returns {string} The floor name
 */
export const getFloorFromRoom = (roomNumber) => {
  const { floor } = parseRoomNumber(roomNumber);
  return floor;
};

/**
 * Gets the block name from a room number
 * @param {string|number} roomNumber - The room number
 * @returns {string} The block name
 */
export const getBlockFromRoom = (roomNumber) => {
  const { block } = parseRoomNumber(roomNumber);
  return block;
};

export default {
  getRoomInfo,
  parseRoomNumber,
  getFloorFromRoom,
  getBlockFromRoom
};