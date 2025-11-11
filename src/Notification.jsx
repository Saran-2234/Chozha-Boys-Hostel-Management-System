function Notification() {

    return(
        <div className={"notification-bar bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 overflow-hidden relative border-b border-slate-300"}>
        <div className={"marquee whitespace-nowrap"}>
            <span className={"inline-block px-8 text-sm font-medium"}>
                🏛️ Chozha Boys Hostel - Government College of Engineering, Thanjavur | 
                📋 Digital Attendance System Now Live | 
                💳 Online Mess Bill Payments Available | 
                🔧 System Maintenance: Dec 25, 2024 (2:00 AM - 4:00 AM) | 
                📞 24/7 Technical Support: +91-XXXX-XXXX | 
                🎓 Serving 250+ Students with Excellence
            </span>
        </div>
    </div>
    );
}

export default Notification;