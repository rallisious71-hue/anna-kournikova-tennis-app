# Anna Kournikova Smash Court Tennis - Interface Design

## Overview

A mobile app for tracking doubles tennis matches between two teams, calculating individual player statistics and team performance metrics.

---

## Screen List

1. **Home Screen** - Main navigation hub
2. **New Match Screen** - Enter player names for both teams
3. **Live Match Screen** - Track games and sets in real-time
4. **Match History Screen** - View past matches
5. **Statistics Screen** - Leaderboard and player stats
6. **Settings Screen** - App preferences

---

## Primary Content and Functionality

### 1. Home Screen
- **Content**: Welcome message, quick action buttons
- **Functionality**: 
  - "Start New Match" button → Navigate to New Match Screen
  - "View Statistics" button → Navigate to Statistics Screen
  - "Match History" button → Navigate to Match History Screen
  - Recent match preview (if available)

### 2. New Match Screen
- **Content**: Four input fields for player names
  - Team 1: Player 1 name, Player 2 name
  - Team 2: Player 3 name, Player 4 name
- **Functionality**:
  - Input validation (no empty names)
  - "Start Match" button → Navigate to Live Match Screen
  - "Cancel" button → Return to Home Screen

### 3. Live Match Screen
- **Content**:
  - Team 1 name and score display
  - Team 2 name and score display
  - Current set and game counter
  - Score increment buttons for each team
  - Match summary (sets won, games won)
- **Functionality**:
  - "+1 Game" buttons for each team to increment games
  - "+1 Set" buttons for each team to increment sets
  - "End Match" button → Save match and return to Home Screen
  - "Undo Last Action" button (optional)

### 4. Match History Screen
- **Content**: List of past matches with:
  - Team 1 vs Team 2
  - Final score (sets and games)
  - Date and time
  - Winner indicator
- **Functionality**:
  - Tap match to view detailed stats
  - Delete match option (swipe or long-press)

### 5. Statistics Screen (Leaderboard)
- **Content**:
  - Player Rankings table:
    - Player name
    - Matches played
    - Wins
    - Win percentage
  - Team Rankings table:
    - Team composition (Player 1 + Player 2)
    - Matches played
    - Wins
    - Win percentage
- **Functionality**:
  - Sortable columns (by wins, percentage, matches)
  - Filter by player or team

### 6. Settings Screen
- **Content**:
  - Dark/Light mode toggle
  - Reset all data option
  - About section
- **Functionality**:
  - Theme switching
  - Clear all matches (with confirmation)

---

## Key User Flows

### Flow 1: Create and Track a Match
1. User taps "Start New Match" on Home Screen
2. Enters 4 player names (Team 1: Player 1 & 2, Team 2: Player 3 & 4)
3. Taps "Start Match"
4. Live Match Screen opens
5. User increments games/sets as match progresses
6. User taps "End Match" when finished
7. Match is saved to history and stats are updated
8. Return to Home Screen

### Flow 2: View Player Statistics
1. User taps "View Statistics" on Home Screen
2. Statistics Screen displays player rankings
3. User can sort by wins, percentage, or matches played
4. User can tap a player to see detailed match history

### Flow 3: Review Match History
1. User taps "Match History" on Home Screen
2. List of past matches appears in reverse chronological order
3. User can tap a match to see detailed breakdown
4. User can delete a match (with confirmation)

---

## Color Choices

| Element | Color | Hex | Usage |
|---------|-------|-----|-------|
| Primary Brand | Tennis Green | #22C55E | Buttons, highlights, active states |
| Secondary | Court Clay | #DC2626 | Team 2 indicator, warnings |
| Background | Light Gray | #F9FAFB | Screen background |
| Surface | White | #FFFFFF | Cards, input fields |
| Text Primary | Dark Gray | #111827 | Main text |
| Text Secondary | Medium Gray | #6B7280 | Secondary text, labels |
| Accent | Sky Blue | #0EA5E9 | Team 1 indicator, accents |
| Success | Green | #10B981 | Win indicators |
| Error | Red | #EF4444 | Error states, delete actions |

---

## Design Principles

- **Mobile-First**: Optimized for portrait orientation (9:16 aspect ratio)
- **One-Handed Usage**: All interactive elements within thumb reach
- **iOS-Native Feel**: Follows Apple Human Interface Guidelines
- **Clear Hierarchy**: Important actions are prominent and easy to find
- **Minimal Cognitive Load**: Simple, focused screens with clear purpose
- **Accessibility**: Large touch targets (minimum 44x44pt), clear contrast

