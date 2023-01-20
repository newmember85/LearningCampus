/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { authAtom } from "./application/Atoms";

const LoginForm: React.FC = () => {
  const [state, setState] = useState({ username: "", password: "" });

  const [token, setToken] = useRecoilState(authAtom);

  const [authStatus, setAuthStatus] = useState("");

  const [isPasswordShown, setIsPasswordShown] = useState(false);

  const navigate = useNavigate();

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setState((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  }
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const response = await fetch("http://localhost:8080/auth/login", {
      body: JSON.stringify(state),
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
    });

    if (response.ok) {
      response.text().then((token) => {
        setAuthStatus("Login erfolgreich");

        navigate("/home");
        return setToken([
          JSON.parse(token)["token"],
          JSON.parse(token)["refreshToken"],
        ]);
      });
    } else {
      setAuthStatus("Login fehlgeschlagen");
    }
  };

  const toggleShowPassword = () => {
    setIsPasswordShown((isShown) => !isShown);
  };

  return (
    <main className="content login-body">
      <header>
        <h1>Learning Campus</h1>
      </header>
      <form className="login" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className="credentials-container">
          <label>Benutzername:</label>
          <input
            type="text"
            name="username"
            value={state.username}
            onChange={handleChange}
          />

          <div className="password-container">
            <label>Passwort:</label>
            <input
              type={isPasswordShown ? "text" : "password"}
              name="password"
              value={state.password}
              onChange={handleChange}
            />

            <div className="show-password">
              <label htmlFor="checkbox">Passwort anzeigen</label>
              <input
                id="checkbox"
                type="checkbox"
                checked={isPasswordShown}
                onChange={toggleShowPassword}
              />
            </div>
          </div>
        </div>
        <button>Einloggen</button>
        <p>{authStatus}</p>
      </form>
    </main>
  );
};

export default LoginForm;
