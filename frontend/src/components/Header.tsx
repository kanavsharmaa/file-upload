import { useContext } from 'react';
// 1. Import values (UserContext, ROLES) normally
import { UserContext, ROLES } from '../contexts/UserContext';
// 2. Import types (IUserContext, Role) using 'import type'
import type { IUserContext, Role } from '../contexts/UserContext';
import { Link } from 'react-router-dom';

export const Header = () => {
  // 3. Use the context.
  // We get the 'currentUser' and 'setCurrentUser' from App.tsx.
  const { currentUser, setCurrentUser } = useContext(UserContext) as IUserContext;

  // 4. This function runs when the dropdown changes.
  const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    // We update the state in App.tsx by calling the function
    // we got from our context.
    setCurrentUser(event.target.value as Role);
  };

  return (
    <header>
      {/* 5. Add a link to go back to the homepage */}
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <h1>FloSmart PDF Annotator</h1>
      </Link>

      {/* 6. This is the user switcher dropdown */}
      <div className="user-switcher">
        <label htmlFor="user-select">Current User:</label>
        <select
          id="user-select"
          value={currentUser}
          onChange={handleUserChange}
        >
          {/* 7. We loop over our ROLES array to create the options */}
          {ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>
    </header>
  );
};