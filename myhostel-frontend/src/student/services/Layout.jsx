import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children, profile }) => {
    return (
        <div className="min-h-screen bg-[#FFFBF9]"> {/* Pure white ki jagah light orange tint background */}
            {/* Fixed Navbar */}
            <Navbar profile={profile} />

            {/* Main Content Area */}
            <main className="pt-28 pb-10 px-4 md:px-8 max-w-[1500px] mx-auto">
                {/* pt-28 ensures content doesn't hide behind the fixed glass navbar */}
                {children}
            </main>
            
            {/* Optional: Mobile Bottom Navigation can go here later */}
        </div>
    );
};

export default Layout;