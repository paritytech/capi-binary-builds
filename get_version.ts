const [repo] = Deno.args

const version = await fetch(`https://api.github.com/repos/${repo}/releases/latest`)
  .then((r) => r.json())
  .then((r) => r.tag_name)

await Deno.writeTextFile(Deno.env.get("GITHUB_OUTPUT")!, `version=${version}`, { append: true })
