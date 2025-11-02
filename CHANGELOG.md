# Changelog
All notable changes to this project will be documented here.

## [0.2.0] - 2025-11-02
### Added
- **Login screen** with felt backdrop, name/PIN, and “Enter Table” CTA.
- **Slide-in card animation** (`ui/SlideCard`) for a real-deal feel.
- **Drag-to-bet** chips (`ui/DragChip`) + chip rack quick-add.
- **Haptics** (`ui/haptics`) for actions and outcomes.
- **Onboarding modal** scaffold (`ui/OnboardModal`).

### Changed
- **RoundScreen** polish pass; improved dealer area and seat layout.

### Fixed
- Removed invalid `"DOUBLE"` check from outcome buttons; added outcome→haptic map.

### Notes
- Expo SDK 54 baseline. Run `npx expo install expo-haptics` if missing.

## [0.1.0] - 2025-10-29
### Added
- Initial app skeleton, rules engine, coaching, and payouts.
