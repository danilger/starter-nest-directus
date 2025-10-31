import { useForm } from "react-hook-form";
import { client, directusClient } from "../shared/lib/fetchClient";

function App() {
  const form = useForm<{ email: string; password: string }>();
  const onSubmit = (data: { email: string; password: string }) => {

    directusClient
      .POST("/auth/login", {
        body: { ...data, mode: "cookie" },
      })
      .then((res) => {
        document.cookie = `access_token=${
          res.data?.data?.access_token || ""
        }; path=/`;
      });
  };

  const refreshHandler = () => {
    directusClient
      .POST("/auth/refresh", {
        body: { mode: "cookie" },
      })
      .then(() => {
      });
  };
  const testApi = () => {
    client.GET("/");
    setTimeout(() => {
      client.GET("/page");
    }, 5);
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
        <button
          type="button"
          onClick={() =>
            document.cookie = "access_token=expired; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"
          }
        >
          Expire access token
        </button>
        <button type="button" onClick={testApi}>
          test api
        </button>
        <a href={import.meta.env.VITE_DIRECTUS_URL} target="_blank">
          admin panel
        </a>
      </div>
    </form>
  );
}

export default App;
