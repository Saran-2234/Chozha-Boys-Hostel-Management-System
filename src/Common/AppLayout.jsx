import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const AppLayout = () => {
    useEffect(() => {
        // Hide initial loader when the layout mounts (which happens after data loaders resolve)
        const loader = document.getElementById('initial-loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.remove();
            }, 500);
        }
    }, []);

    return <Outlet />;
};

export default AppLayout;
