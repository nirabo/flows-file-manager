# flows-file-manager

A package that can manage your Node-RED flows file to easily switch from a monolith to a tree structure and forth

## Known Issues

- In previous versions (< 0.2.1), the library could crash when processing config nodes without a `site` property, during tab reordering with missing tab references, or when reading non-existent directories. These issues have been fixed in version 0.2.1.

## Troubleshooting

- When switching between `YAML` and `JSON` formats, it is recommended to restart Node-RED to ensure that the new files are correctly loaded.

## Recommended Node.js Version

- This library requires Node.js version 14.x or higher.
