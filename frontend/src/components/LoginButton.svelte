<script>
  let name;
  const login = async () => {
    const res = await fetch(`https://astro-ssr-trial.cancer6.workers.dev/login/?name=${name}`, {
      mode: "cors",
      credentials: "include"
    });
    if (!res.ok) throw new Error(await res.text());
    return null;
  }
</script>

<input bind:value={name} type="text" />

<button on:click={login} disabled={name === undefined ? true : null}>Login</button>