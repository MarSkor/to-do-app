import { Outlet } from "react-router";
import Header from "../components/Header";

const Layout = () => {
  return (
    <main className="main-container ">
      <section className="container">
        <Header />
        <Outlet />
      </section>
    </main>
  );
};

export default Layout;
