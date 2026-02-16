import ToggleTheme from "./ToggleTheme";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Header = () => {
  const { user, logoutUser, deleteAccount } = useAuth();

  const handleDeleteAccount = async () => {
    const isConfirmed = window.confirm(
      "Are you sure? This will permanently delete your account and all tasks. This action cannot be undone.",
    );

    if (!isConfirmed) return;
    try {
      await deleteAccount();
      toast.success("Account deleted.");
    } catch (error) {
      toast.error("Failed to delete account");
    }
  };

  return (
    <section className="header__wrapper">
      <div className="header__content">
        <div className="header__content--logo  grid-item-1">
          <h1 className="header__title">To Do</h1>
        </div>

        <div className="header__content--btn-group  grid-item-2">
          {user ? (
            <div className="header__action-section--btn-group">
              <button
                className="btn btn__delete-account"
                type="button"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </button>
              <button
                type="button"
                className="btn btn__logout"
                onClick={logoutUser}
              >
                Log Out
              </button>
            </div>
          ) : null}
        </div>

        <div className="header__content--theme-toggle  grid-item-3">
          <ToggleTheme />
        </div>
      </div>
    </section>
  );
};

export default Header;
