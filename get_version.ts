const [repo] = Deno.args

const release = await fetch(`https://api.github.com/repos/${repo}/releases/latest`)
  .then((r) => r.json())

console.log(release)

const version = release.tag_name

if (!version) throw new Error("no tag_name for latest version")

await Deno.writeTextFile(Deno.env.get("GITHUB_OUTPUT")!, `version=${version}`, { append: true })
