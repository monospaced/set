# Vendored DTCG Schemas

Schemas in `packages/system/schemas/<version>/schema/` are vendored from the official DTCG endpoints and committed for reproducibility.

Reference spec markdown is also vendored under `packages/system/schemas/<version>/spec/` for local/offline guidance. Treat `spec/` as reference docs, not runtime schema inputs.

## Refresh / version bump (manual)

When updating schema versions, do it intentionally and manually:

1. Download the official schema files from `https://www.designtokens.org/schemas/<version>/`.
2. Place schema JSON files under `packages/system/schemas/<version>/schema/` preserving relative paths.
3. Place optional reference markdown under `packages/system/schemas/<version>/spec/`.
4. Update `$schema` paths in:
   - `packages/system/src/**/*.json`
   - `packages/system/resolver/**/*.resolver.json`
5. Validate JSON and schema resolution in VS Code.
