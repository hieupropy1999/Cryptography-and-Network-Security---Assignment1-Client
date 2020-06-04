import React from 'react';
import {NavLink} from 'react-router-dom';

const Navigation = (props) =>{
        return (
            <div className="mb-5 navbar navbar-dark bg-dark d-flex justify-content-end container">
                <ul className="nav nav-tabs" style={{border: "none"}}>
                    <li className="nav-item">
                        <NavLink activeClassName="selected" className="nav-link ml-2" to="/" exact >Encrypt & Decrypt</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink activeClassName="selected" className="nav-link " to="/check" exact>Check Sum</NavLink>
                    </li>
                </ul>
            </div>
        );

}

export default Navigation;