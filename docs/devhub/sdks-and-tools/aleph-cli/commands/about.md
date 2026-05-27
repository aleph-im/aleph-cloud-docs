# Version & Shell Completions

## Show Version

Display the version of the installed Aleph CLI.

```bash
aleph --version
```

This prints the version, commit hash, and build date in the form `aleph <version> (<commit> <date>)`.

## Shell Completions

Generate a shell completion script and add it to your shell configuration. The `completions` command supports Bash, Elvish, Fish, PowerShell, and Zsh.

### Usage

```bash
aleph completions <SHELL>
```

#### Arguments

| Argument | Description                                              |
|----------|----------------------------------------------------------|
| `SHELL`  | Target shell: `bash`, `elvish`, `fish`, `powershell`, `zsh` |

### Examples

For shells with a per-shell completions directory (Fish, Zsh with `fpath`),
write the script there directly so it gets loaded on the next shell start:

```bash
# Fish
aleph completions fish > ~/.config/fish/completions/aleph.fish
```

For shells without a dedicated completions directory (Bash, plain Zsh setups),
generate the script on the fly from your rc file. This adds *one* line to your
rc and always uses the currently-installed CLI version:

```bash
# Bash
echo 'source <(aleph completions bash)' >> ~/.bashrc

# Zsh
echo 'source <(aleph completions zsh)' >> ~/.zshrc

# Elvish
echo 'eval (aleph completions elvish | slurp)' >> ~/.config/elvish/rc.elv
```

If you'd rather not run `aleph` on every shell start (e.g. for startup time),
cache the script to a file once and source the file instead:

```bash
mkdir -p ~/.local/share/aleph
aleph completions bash > ~/.local/share/aleph/completions.bash
echo 'source ~/.local/share/aleph/completions.bash' >> ~/.bashrc
# Re-run the first two lines after upgrading `aleph` to refresh the cache.
```

PowerShell uses its profile script directly:

```powershell
aleph completions powershell | Out-File -FilePath $PROFILE -Append
```

After updating your rc / profile, reload your shell (e.g. `source ~/.bashrc`)
or open a new terminal session.
