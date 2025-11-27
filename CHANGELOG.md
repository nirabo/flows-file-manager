## [0.2.1] - 2024-11-27

### Fixed
- Fixed crash when processing config nodes without `site` property (#1)
- Fixed crash during tab reordering with missing tab references (#2)
- Fixed crash when reading non-existent directories (#3)

### Improved
- Added graceful handling of format switching (YAML ↔ JSON)
- Added validation for directory structure before operations
- Improved error messages for debugging configuration issues
