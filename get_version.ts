const [type, repo] = Deno.args

const headers = {
  Authorization: `token ${Deno.env.get("GITHUB_TOKEN")!}`,
}

const types: Record<string, () => Promise<[string, string?]>> = {
  async release() {
    const release = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, { headers })
      .then((r) => r.json())

    console.log(release)

    return [release.tag_name]
  },
  async commit() {
    const commit = await fetch(`https://api.github.com/repos/${repo}/commits/@`, { headers })
      .then((r) => r.json())

    console.log(commit)

    return [commit.sha.slice(0, 7), commit.sha]
  },
}

if (!(type in types)) throw new Error(`unrecognized type ${type}`)

const [version, ref = version] = await types[type]()

if (!version) throw new Error("version fetching failed")

await Deno.writeTextFile(
  Deno.env.get("GITHUB_OUTPUT")!,
  `
version=${version}
ref=${ref}
`.trim(),
  { append: true },
)
