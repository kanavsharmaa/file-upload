import { Link } from 'react-router-dom';
import { useUserContext, ROLES } from '@contexts/UserContext';
import type { Role } from '@/types';
import styles from './Header.module.css';

export const Header = () => {
  const { currentUser, setCurrentUser } = useUserContext();

  const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setCurrentUser(event.target.value as Role);
  };

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.titleLink}>
        <h1 className={styles.title}>FloSmart PDF Annotator</h1>
      </Link>

      <div className={styles.userSwitcher}>
        <label htmlFor="user-select" className={styles.label}>
          Current User:
        </label>
        <select
          id="user-select"
          value={currentUser}
          onChange={handleUserChange}
          className={styles.select}
        >
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
