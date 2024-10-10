import { FormEvent } from 'react';

export function Login() {
  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('oi o login');
  };

  return (
    <section>
      <h1>Biblioteka</h1>
      <h2>Login</h2>

      <form className="flex flex-col bg-blue-300" onSubmit={handleLogin}>
        <label htmlFor="username">Usuário:</label>
        <input id="username" name="username" autoComplete="off" type="text" />
        <label htmlFor="password">Senha:</label>
        <input id="password" name="password" autoComplete="off" type="password" />
        <button type="submit">Entrar</button>
      </form>
    </section>
  );
}
