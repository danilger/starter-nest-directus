import { useForm } from "react-hook-form";
import { directusClient } from "../shared/lib/fetchClient";

function App() {
  const form = useForm<{ email: string; password: string }>();
  const onSubmit = (data: { email: string; password: string }) => {
    console.log(data);
    console.log(import.meta.env.VITE_DIRECTUS_API_URL);

    directusClient
      .POST("/auth/login", {
        body: { ...data, mode: "cookie" },
      })
      .then((res) => {
        console.log(res);
      });
  };

  const refreshHandler = () => {
    directusClient
      .POST("/auth/refresh", {
        body: { mode: "cookie" },
      })
      .then((res) => {
        console.log(res);
      });
  };
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          gap: "10px",
        }}
      >
        <h1>Login</h1>
        <input type="email" {...form.register("email")} />
        <input type="password" {...form.register("password")} />
        <button type="submit">Login</button>
        <button type="button" onClick={refreshHandler}>
          Refresh
        </button>
      </div>
    </form>
  );
}

export default App;
