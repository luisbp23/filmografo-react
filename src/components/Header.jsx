import './Header.css'
import { Link } from 'react-router-dom';

function Header() {
    return (
        <div className="d-flex align-items-center justify-content-between px-3 py-2 header">
            
            <Link to="/home" className='logo'>
                <img className='logo-normal' src="flogo.png" alt="logótipo" height="96" />
                <img className='logo-hover' src="flogo_amarelo.png" alt="logótipo" height="96" />
            </Link>

            <div className="d-flex align-items-center search-bar flex-grow-1 mx-4">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M14.9536 14.9458L21 21M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input type="text" placeholder="Pesquisar..." />
            </div>

            <div className="d-flex align-items-center gap-3 header-icons">
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
                    <path d="M6 12H18M12 6V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <svg width="56" height="56" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                </svg>
            </div>

        </div>
    );
}

export default Header;