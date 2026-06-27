import './Footer.css'
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="d-flex align-items-center justify-content-center px-3 py-2 footer">
            <Link to="/" className='logo'>
                <img className='logo-normal' src="flogo.png" alt="logótipo" height="96" />
                <img className='logo-hover' src="flogo_amarelo.png" alt="logótipo" height="96" />
            </Link>
            <div>
                <h3>Filmógrafo</h3>
                <p>TWAM - 2026</p>
            </div>
        </footer>
    )
}

export default Footer;