# flows-file-manager

Node-RED Flow Manager simplifies the management of Node-RED flows by enabling seamless parsing, transformation, and file generation for monolithic and tree-structured flow configurations. Built with the official @node-red/flow-parser library, it ensures compatibility and reliability.

## Features

- **Parse Flows**: Convert monolithic Node-RED flow files or objects into structured `flowSet` objects.
- **Generate Tree Structure**: Split flows into organized folders and files (tabs, subflows, and config nodes) in JSON or YAML formats.
- **Reconstruct Flows**: Rebuild monolithic or tree-structured flows from their components.
- **Tab Ordering**: Maintain or modify the order of flow tabs for better organization.

## Installation

```bash
npm install flows-file-manager
```

## Known Issues

- In previous versions (< 0.2.1), the library could crash when processing config nodes without a `site` property, during tab reordering with missing tab references, or when reading non-existent directories. These issues have been fixed in version 0.2.1.

## Troubleshooting

- When switching between `YAML` and `JSON` formats, it is recommended to restart Node-RED to ensure that the new files are correctly loaded.

## Recommended Node.js Version

- This library requires Node.js version 16.x or higher.
