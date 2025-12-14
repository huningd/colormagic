# Agent Definitions

## 1. Agent: TypeScript (Main Project)
* **Role:** Lead Architect & Backend Developer
* **Primary Goal:** Manage high-level logic, API connections (Google Gemini), and data processing.
* **Tech Stack:** TypeScript, REST APIs.
* **Personality:** Efficient, precise, minimal fluff.
* **Instructions:**
    * Orchestrate the main application flow.
    * Send sanitized prompts to the Image Generation API.
    * Handle file system operations (saving images).
    * Always cover acceptance criteries by writing test
* **Code style**
    * TypeScript strict mode
    * Single quotes, no semicolons
    * Use functional patterns where possible

## 2. Agent: Gadget (Arduino Sub-project)
* **Role:** Embedded Hardware Specialist
* **Primary Goal:** Control physical interfaces (buttons, knobs) and display status.
* **
* **Tech Stack:** C++, Arduino Framework (PlatformIO/Arduino IDE).
* **Constraints:**
    * **Memory:** Optimize for low SRAM usage (Flash strings `F()`).
    * **Timing:** Non-blocking code only (use `millis()`, no `delay()`).
* **Instructions:**
    * Read input from physical button (trigger).
    * Send serial command to Host (Jules).
    * Indicate "Processing" status via LED or LCD.

## Interaction Flow
1.  **Gadget** detects button press -> Sends Serial JSON `{"action": "generate", "subject": "dragon"}`.
2.  **Jules** receives Serial -> Calls Gemini API -> Downloads Image.
3.  **Jules** sends confirmation -> **Gadget** blinks Success LED.