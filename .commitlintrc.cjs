module.exports = {
  extends: ["@commitlint/config-conventional"],
  ignores: [
    // ignore dependabot commits
    (message) => message.includes("Signed-off-by: dependabot[bot] <support@github.com>"),
  ],
}
