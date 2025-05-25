# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] 

### Fixed

- html minification resulting the completed html document, `<html>` elements are unnecessary
- incorrect fetch of default ui mode, also, it could be overriden


## [1.0.0] - 2024-05-02

### Added

- Improve testing before 1.0.0 release

## [0.6.0] - 2024-10-10

### Added

- BREAKING CHANGE: remove quotation mark from --ui-mode

## [0.5.0] - 2023-12-21

### Added

- reduce npm package size from 1.26 MB to 99.5 kB (unpacked size)
- clean package.json on npm package
- improve documentation

## [0.4.0] - 2023-12-11

### Added

- npm package support
- ESM dist, no need to configure bundler to use an asset as it is converted to JS
- Breaking change: Change "--color-wheel--inner-radius" to "--color-wheel-inner-radius"

## [0.3.0] - 2023-1-31

### Added

- add support for absolute units on inner radius
- improve documentation
- add unit test

## [0.2.0] - 2023-01-26

### Added

- color wheel is now resizable


## [0.1.0] - 2023-01-21

### Added

- First release, the component is usable. Needs more testing and documentation


