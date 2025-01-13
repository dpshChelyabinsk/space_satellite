import React, { useEffect, useState } from 'react';
import App from './App';
import Loader from './components/Loader';

const AppLoader = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 0);

        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <Loader />;
    }
    return <App />;
};

export default AppLoader;
