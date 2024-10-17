# JSON Dynamic Widget Helper

## Overview

JSON Dynamic Widget Helper is a Visual Studio Code extension designed to assist developers working with the [`json_dynamic_widget`](https://pub.dev/packages/json_dynamic_widget) package for Flutter. This extension provides tools to manipulate JSON structures, making it easier to work with dynamic widgets in your Flutter projects.

## Features

- Wrap existing widgets with new parent widgets (e.g., Column, Row, Container, or custom widgets)
- Remove selected widgets from the widget tree
- Quick and easy manipulation of JSON structures for [`json_dynamic_widget`](https://pub.dev/packages/json_dynamic_widget)

## Demo

![JSON Dynamic Widget Helper Demo](https://raw.githubusercontent.com/cem256/json-dynamic-widget-helper/master/assets/gif/usage.gif)

## Installation

1. Open Visual Studio Code
2. Go to the Extensions view (Ctrl+Shift+X or Cmd+Shift+X)
3. Search for "JSON Dynamic Widget Helper"
4. Click Install

## Usage

1. Open a JSON file containing `json_dynamic_widget` structures in VS Code.
2. Place your cursor on the "type" key of the widget you want to modify.
3. Press `Cmd + .` (Mac) or `Ctrl + .` (Windows/Linux) to open the code actions menu.
4. Choose from the available options:
   - Wrap with Column
   - Wrap with Row
   - Wrap with Container
   - Wrap with Center
   - Wrap with custom widget...
   - Remove this widget

### Wrapping a Widget

1. Select the "type" key of the widget you want to wrap.
2. Open the code actions menu.
3. Choose "Wrap with..." and select the desired wrapper widget.
4. The extension will automatically wrap your selected widget with the chosen parent widget.

### Removing a Widget

1. Select the "type" key of the widget you want to remove.
2. Open the code actions menu.
3. Choose "Remove this widget".
4. The extension will remove the selected widget from the JSON structure.

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please feel free to submit pull requests or open issues on the GitHub repository.