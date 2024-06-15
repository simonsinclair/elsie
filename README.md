# Elsie

## Notes

### "Please install latest version of drizzle-orm"
In order to fix the above error when running `drizzle-kit`, we declare `drizzle-orm` as a root dependency. See: https://github.com/drizzle-team/drizzle-kit-mirror/issues/406#issuecomment-2163856992.

```json
"dependencies": {
  "drizzle-orm": "^0.31.2"
}
```
