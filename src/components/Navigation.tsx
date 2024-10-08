import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu } from "lucide-react";

export default function Navigation() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const NavLink = ({ href, text }: { href: string, text: string }) => (
        <li>
            <Link to={href} className="flex items-center rounded-lg px-4 py-2 text-black hover:bg-gray-100 relative">
                    {text}
            </Link>
        </li>
    );

    return (
        <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex h-16 items-center justify-center border-b">
              <h1 className="text-2xl font-bold text-gray-800">BulkApp</h1>
            </div>
            <nav className="flex-1 space-y-1 px-2 py-4">
              <NavLink
                href="/"
                text="Home"
              />
              <NavLink
                href="/add-exercise"
                text="Add Exercise"
              />
              <NavLink
                href="/workout"
                text="Workout"
              />
              
              <NavLink
                href="/analyze"
                text="Analyze"
              />
              
            </nav>
          </SheetContent>
        </Sheet>
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            <h1 className="text-2xl font-bold text-[#571f8b]">BulkApp</h1>
          </Link>
  
          <ul className="hidden lg:flex space-x-6">
            
                <li>
                  <Link
                    to="/add-exercise"
                    className="flex items-center rounded-lg px-4 py-2 text-black hover:bg-gray-100 relative"
                  >
                    Add Exercise
                  </Link>
                </li>
                <li>
                  <Link
                    to="/workout"
                    className="flex items-center rounded-lg px-4 py-2 text-black hover:bg-gray-100 relative"
                  >
                    Workout
                  </Link>
                </li>
                <li>
                  <Link
                    to="/analyze"
                    className="flex items-center rounded-lg px-4 py-2 text-black hover:bg-gray-100 relative"
                  >
                    Analyze
                  </Link>
                </li>
                <li>
                  <Link
                    to="/workout"
                    className="flex items-center rounded-lg px-4 py-2 text-black hover:bg-gray-100 relative"
                  >
                Workout
                  </Link>
                </li>
              
          </ul>
          </nav>
      </div>
    )
}