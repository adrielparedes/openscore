Stage all changes, commit using conventional commits format, and push to the current branch.

If $ARGUMENTS is provided, use it as the commit message. Otherwise, inspect the diff and write an appropriate conventional commit message.

Steps:
1. Run `git status` and `git diff` to understand what changed
2. Run `git add -A`
3. Commit with the message (use HEREDOC format to avoid shell escaping issues)
4. Run `git push`

Follow the conventional commits format (feat:, fix:, refactor:, etc.). Do not add yourself as co-author.
