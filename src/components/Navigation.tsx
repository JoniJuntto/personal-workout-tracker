import { Link } from "react-router-dom";

export default function Navigation() {
    return(
        <header>
            <nav className="flex justify-between items-center p-4">
                <ul className="flex gap-4">
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/add-exercise">Add Exercise</Link>
                    </li>
                    <li>
                        <Link to="/analyze">Analyze</Link>
                    </li>
                    <li>
                        <Link to="/workout">Workout</Link>
                    </li>   
                </ul>
            </nav>
        </header>
    )
}