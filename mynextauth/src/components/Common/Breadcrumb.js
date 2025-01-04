import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Breadcrumb.css'; // Optional CSS styles

const Breadcrumb = () => {
    const location = useLocation();
    const paths = location.pathname.split('/').filter(Boolean);

    const formatPath = (path) => {
        return path
            .replace(/-/g, ' ')
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    return (
        <nav aria-label="breadcrumb" className='breadcrumb'>
            <ol className="breadcrumb">
                <li className="breadcrumb-item">
                    <Link to="/"><i className="fas fa-home"></i> Home</Link>
                </li>
                {paths.map((path, index) => {
                    const url = `/${paths.slice(0, index + 1).join('/')}`;
                    return (
                        <li
                            key={index}
                            className={`breadcrumb-item ${index === paths.length - 1 ? 'active' : ''}`}
                            aria-current={index === paths.length - 1 ? 'page' : undefined}
                       >
                            {index === paths.length - 1
                                ? formatPath(path)
                                : <Link to={url}>{formatPath(path)}</Link>}
                                
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumb;
