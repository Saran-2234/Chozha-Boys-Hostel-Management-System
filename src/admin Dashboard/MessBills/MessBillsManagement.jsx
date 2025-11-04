import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://finalbackend1.vercel.app';

const MessBillsManagement = ({ isDarkMode }) => {
  const [activeSection, setActiveSection] = useState('new-bill');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [existingBillsData, setExistingBillsData] = useState([]);

  // New bill form state
  const [residentName, setResidentName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [month, setMonth] = useState('');
  const [daysPresent, setDaysPresent] = useState('');
  const [mealRate, setMealRate] = useState('');
  const [extraCharges, setExtraCharges] = useState('');

  // Bill summary state
  const [billSummary, setBillSummary] = useState(null);

  // Helper functions
  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '0.00';
    return parseFloat(amount).toFixed(2);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Navigation functionality
  const handleNavClick = (target) => {
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));

    document.querySelector(`[data-target="${target}"]`).classList.add('active');
