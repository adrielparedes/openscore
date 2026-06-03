Stage all changes and commit using conventional commits format.

If $ARGUMENTS is provided, use it as the commit message. Otherwise, inspect the diff and write an appropriate conventional commit message.

Steps:
1. Run `git status` and `git diff` to understand what changed
2. Run `git add -A`
3. Commit with the message (use HEREDOC format to avoid shell escaping issues)

Follow the conventional commits format (feat:, fix:, refactor:, etc.). Do not add yourself as co-author.
