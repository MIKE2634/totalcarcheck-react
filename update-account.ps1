$ErrorActionPreference = "Stop"
$path = ".\src\App.jsx"
$content = Get-Content $path -Raw

if ($content -notmatch '/\* LOGIN AND REGISTER \*/' -or
    $content -notmatch '/\* NOT FOUND PAGE \*/') {
  throw "Account page markers not found. No changes made."
}

Copy-Item $path ".\src\App.jsx.backup" -Force

if ($content -notmatch 'from "\./api\.js"|from "\./api"') {
  $content = $content -replace '(?m)^import \{ useState \} from "react";',
'import { useState } from "react";
import { register as apiRegister, login as apiLogin } from "./api.js";'
}

$start = $content.IndexOf("/* LOGIN AND REGISTER */")
$end = $content.IndexOf("/* NOT FOUND PAGE */", $start)

$replacement = @"
/* LOGIN AND REGISTER */

function AccountPage({ register = false }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  async function submit(event) {
    event.preventDefault();
    setMessage("");
    setBusy(true);

    try {
      const result = register
        ? await apiRegister(email.trim(), password, fullName.trim())
        : await apiLogin(email.trim(), password);

      sessionStorage.setItem("tcc_token", result.token);
      sessionStorage.setItem("tcc_user", JSON.stringify(result.user));
      navigate("/");
    } catch (error) {
      setMessage(error.message || "Request failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <PageLayout
      title={register ? "Register" : "Login"}
      subtitle={register ? "Create your account" : "Access your account"}
    >
      <form className="account-form" onSubmit={submit}>
        <h2>{register ? "Create an account" : "Welcome back"}</h2>

        {register && (
          <>
            <label htmlFor="fullName">Full name</label>
            <input
              id="fullName"
              type="text"
              maxLength={100}
              placeholder="Your full name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
            />
          </>
        )}

        <label htmlFor="email">Email address</label>
        <input
          id="email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          minLength={12}
          maxLength={128}
          required
          autoComplete={register ? "new-password" : "current-password"}
          placeholder={register ? "At least 12 characters" : "Enter your password"}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <button type="submit" className="blue-button" disabled={busy}>
          {busy ? "Please wait..." : register ? "Create Account" : "Login"}
        </button>

        {message && (
          <p className="demo-notice" role="alert">{message}</p>
        )}

        <p>
          {register ? "Already registered?" : "New here?"}{" "}
          <Link to={register ? "/login" : "/register"}>
            {register ? "Login" : "Register"}
          </Link>
        </p>
      </form>
    </PageLayout>
  );
}

"@

$content = $content.Substring(0, $start) + $replacement + $content.Substring($end)
Set-Content -Path $path -Value $content -Encoding utf8

Write-Host "Account page connected to the API." -ForegroundColor Green
