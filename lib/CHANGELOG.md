# Changelog

All notable changes to `generic-sequence-panel` are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).
Versions prior to 1.4.0 are summarized rather than itemized individually.

## [2.0.0] - 2026-07-14

### Changed

- **Breaking:** the default feature-data adapter is now a bgzip-compressed,
  tabix-indexed GFF3 file instead of the JBrowse 1 NCList format. Existing
  integrations passing `nclistbaseurl`/`urltemplate` must add
  `adapterType="nclist"` to keep the previous behavior — see "Upgrading to
  2.0" in the README.

### Added

- `adapterType` prop on `GenericGeneSeqPanel` (`"tabix"` default, `"nclist"`
  opt-in for backward compatibility).
- `gffurl` prop for the new tabix adapter.
- `fetchTranscriptsTabix` export, the tabix-adapter equivalent of
  `fetchTranscripts`.

## [1.8.0] - 2026-04-06

### Changed

- `GenericGeneSeqPanel` no longer renders a visible red error box on fetch
  failure; it now renders nothing, since production failures at MOD sites
  were confusing end users.

## [1.7.0] - 2025-02-26

### Changed

- Replaced `reactstrap` with `react-bootstrap` to enable full React 19
  support.

## [1.6.1] - 2024-12-20

### Fixed

- Minor UI polish: added a "Mode:" label and fixed spacing between the
  transcript and mode selectors.

## [1.6.0] - 2024-12-18

### Changed

- Updated the explanatory note about upper/lower case bases in the
  generated FASTA.

## [1.5.3] - 2024-12-11

### Added

- React 19 as a supported peer dependency.

## [1.5.2] - 2024-11-25

### Changed

- Routine release (dependency/version bump).

## [1.5.1] - 2024-07-19

### Added

- React 18 as a supported peer dependency.

## [1.5.0] - 2024-06-12

### Added

- Exported `fetchTranscripts` as a public API.

## [1.4.1] - 2024-03-22

### Added

- An on-page note clarifying that transcript/protein sequences are derived
  from GFF coordinate mapping and may differ from the corresponding NCBI
  RefSeq entry.

## [1.4.0] - 2024-02-26

### Added

- A guard that throws a clear error when fetching viral (SARS-CoV-2)
  sequences, which aren't yet supported, instead of failing obscurely.

## [1.0.0] through [1.3.1] - 2023

Initial public releases: core `GenericSeqPanel`/`GenericGeneSeqPanel`
components backed by the NCList adapter, plus iterative UI and packaging
fixes.
