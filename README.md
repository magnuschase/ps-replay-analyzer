<div align="center"><img src="public/icon-128.png" alt="logo"/>
<h3>Pokemon Showdown Replay Analyzer</h3>

[![Firefox Add-on](https://img.shields.io/amo/v/ps-replay-analyzer?label=Firefox%20Add-on&style=for-the-badge)](https://addons.mozilla.org/en-US/firefox/addon/ps-replay-analyzer/)
</div>

## Intro

**PS Replay Analyzer** is a browser extension developed primarily for **Firefox** (with Chrome support) that streamlines the collection and sharing of Pokemon Showdown battle data.

Instead of manually downloading or uploading replays, this extension automatically detects when a battle finishes. It captures the replay log for local analysis and triggers the **Upload and share replay** command. This ensures your battles are both stored locally for review and have a permanent URL generated for reporting tools.

## Architecture

The project follows a modular architecture separating concerns between data ingestion, parsing logic, and storage.

### Core Components

- **Content Script & Injected Script**: Observes the DOM for the appearance of the replay download button post-battle. When detected, it generates the replay blob and extracts the raw log.
- **Background Script**: Acts as the central hub, receiving logs, invoking the parser, and persisting data to IndexedDB.
- **Parser Engine**: A strategy-based parser that converts raw text logs into structured `BattleGame` objects.
- **Repository**: An abstraction layer over IndexedDB to manage battle data persistence.

### Class Diagram

Refer to the [Architecture Diagram](./docs/classDiagram.mmd) for a visual representation of the system's class structure and relationships.

![Class Diagram](docs/generated/classDiagram.svg)

## Design Patterns

This project leverages several software design patterns to ensure maintainability and scalability:

- **Strategy Pattern**: The `LogParser` uses specific strategies (e.g., `PlayerStrategy`, `SwitchStrategy`) to handle different types of log lines (`|player|`, `|switch|`, etc.), allowing for easy extension of parsing logic without modifying the core parser.
- **Repository Pattern**: `IndexedDBBattleRepository` implements `IBattleRepository`, providing a clean abstraction for data access and decoupling the business logic from the underlying storage mechanism (IndexedDB).
- **Observer Pattern**:
  - `MutationObserver` is used in the content script to watch for DOM changes (specifically the appearance of the download button).
  - The extension uses Chrome's messaging system to publish events (like log capture) that the background script subscribes to.
- **Inversion of Control (IoC)**: The `LogParser` acts as a central coordinator that delegates specific tasks to registered strategies, promoting loose coupling.

## Features

- **Automatic Log Extraction**: Automatically detects battle completion and captures raw logs without manual intervention.
- **Automatic Replay Upload**: Triggers the "Upload and share replay" command and automatically closes the success modal.
- **PASRS Compatibility**: Streamlines data entry for the [PALKIA Academy Showdown Reporting Spreadsheet (PASRS)](https://devoncorp.press/resources/the-release-of-pasrs-6-2) by providing immediate replay URLs.
- **Local Battle Storage**: Persists analyzed battle data locally using IndexedDB for offline review and historical tracking.

## Tech Stack

- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **Vite** with CRXJS
- **IndexedDB** for local persistence

## Usage

### Developing and Building

This project is configured to support both Firefox and Chrome.

1. **Install Dependencies**:

   ```bash
   npm install
   # or
   yarn
   ```

2. **Development (Watch Mode)**:
   Running a `dev` command will build your extension and watch for changes in the source files.

   **For Firefox (Recommended):**

   ```bash
   npm run dev:firefox
   # or
   yarn dev:firefox
   ```

   This will output to `dist_firefox`.

   **For Chrome:**

   ```bash
   npm run dev:chrome
   # or
   yarn dev:chrome
   ```

   This will output to `dist_chrome`.

3. **Production Build**:
   To create an optimized production build:

   ```bash
   npm run build:firefox  # Output: dist_firefox
   npm run build:chrome   # Output: dist_chrome
   ```

### Loading the Extension

#### For Firefox

1. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on**.
3. Navigate to the `dist_firefox` folder in this project.
4. Select the `manifest.json` file.

#### For Chrome

1. Open Chrome and navigate to `chrome://extensions`.
2. Enable **Developer mode** (toggle in the top right).
3. Click **Load unpacked**.
4. Select the `dist_chrome` folder in this project.

## Examples

Check out the `examples/` directory for visual demonstrations:

- **Automatic log extraction & parsing**:
  ![Replay Extension](docs/examples/game2.png)

- **Generated static replay file**:
  ![Showdown Replay](docs/examples/generated_replay_extension.png)

