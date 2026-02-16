import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import errorHandler from "../utils/errorHandler";

const AuthForm = ({ isRegister = false }) => {
  const { loginUser, registerUser } = useAuth();
  const [globalError, setGlobalError] = useState("");
  let navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setGlobalError("");
    try {
      if (isRegister) {
        await registerUser(data);
        navigate("/todos");
      } else {
        await loginUser(data);
        navigate("/todos");
      }
    } catch (error) {
      if (
        error.response?.data?.errors &&
        Array.isArray(error.response.data.errors)
      ) {
        error.response.data.errors.forEach((validationError) => {
          setError(validationError.path, {
            type: "server",
            message: validationError.msg,
          });
        });
        return;
      }
      const message = errorHandler(error);
      setGlobalError(message);
    }
  };

  return (
    <section className="form__wrapper auth-form">
      <h2 className="form__title">
        {isRegister ? "Create Account" : "Welcome Back"}
      </h2>

      {globalError && (
        <div className="global-form-error">
          <p>{globalError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="form__form">
        <fieldset className="form__fieldset">
          <input
            className={`form__input ${errors.email ? "form-input-error" : ""}`}
            type="email"
            placeholder="you@example.com"
            {...register("email", {
              required: "Email is required.",
            })}
            autoComplete="off"
          />
          {errors.email && (
            <span className="inputHasError">{errors.email.message}</span>
          )}
        </fieldset>

        <fieldset className="form__fieldset">
          <input
            className={`form__input ${errors.password ? "form-input-error" : ""}`}
            type="password"
            placeholder="Enter Password"
            {...register("password", {
              required: "Password is required.",
            })}
            autoComplete="off"
          />
          {errors.password && (
            <span className="inputHasError">{errors.password.message}</span>
          )}
        </fieldset>

        <button disabled={isSubmitting} className="form__btn" type="submit">
          {isSubmitting ? "Loading..." : isRegister ? "Sign Up" : "Log In"}
        </button>
      </form>
      <footer className="form__footer">
        <p>
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <Link
            to={isRegister ? "/" : "/register"}
            className="form__footer--link"
          >
            {isRegister ? "Log in here" : "Register here"}
          </Link>
        </p>
      </footer>
    </section>
  );
};

export default AuthForm;
