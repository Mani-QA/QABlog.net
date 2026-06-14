---
title: "The Flaky Test Manifesto: Eliminating Non-Determinism in CI/CD"
description: "A technical guide to detecting, diagnosing, and eradicating flaky test suites that slow down CI pipelines and erode developer trust."
pubDate: "2026-06-13"
author: "Mani G."
tags: ["CI/CD", "Flaky Tests", "Test Automation", "Debugging"]
category: "CI/CD Pipelines"
coverImage: "/images/flaky_test_card.png"
---

A test suite that exhibits non-deterministic behavior is worse than no test suite at all. 

When a test fails intermittently without any change to the application code, developers learn to ignore test failures. They hit "Re-run" on the CI pipeline until the build turns green. This habit erodes the core value of continuous integration: providing a reliable signal of code health. Once developers start ignoring test failures, actual regression bugs slip into production unnoticed.

### The Anatomy of Flakiness

To eliminate flaky tests, we must first understand why they occur. The most common root causes of non-determinism include:

1. **Shared State and Data Contamination:** Tests that rely on a shared database or global memory state can interfere with one another. If Test A deletes a record that Test B expects to find, the outcome of Test B depends entirely on the execution order.
2. **Race Conditions and Hardcoded Sleep Statements:** Modern web applications are asynchronous. When automation scripts use arbitrary wait statements (e.g., `time.sleep(2000)`) to wait for an element to appear, they are prone to failure. If the CI runner is heavily loaded, the element might take 2050ms to load, causing the test to fail.
3. **Network Latency and External Dependencies:** Tests that make real HTTP requests to external third-party APIs will fail whenever those APIs are slow, rate-limiting, or down.
4. **Incorrect Date/Time Mocking:** Tests that calculate dates dynamically can fail when run at midnight, during daylight saving time transitions, or across different server time zones.

### Strategies for Eradication

Eliminating flakiness requires engineering discipline. Here is how to clean up your pipelines:

- **Isolate Test Data:** Every test should set up its own data and clean up after itself. Use unique identifiers (UUIDs) for test entities to prevent duplicate key constraint issues. Better yet, run tests inside transactional rollbacks or dedicated database containers.
- **Use Smart Wait Mechanisms:** Never use hardcoded sleep statements. Instead, use explicit waits that poll the DOM or API until a specific state is met (e.g., Playwright's auto-waiting or Selenium's `WebDriverWait`). Set reasonable timeouts.
- **Mock and Stub Externals:** Isolate your tests from the public internet. Use mock servers (like WireMock or MSW) or contract tests to simulate third-party API behaviors. This guarantees speed and execution stability.
- **Quarantine Flaky Tests:** Implement a pipeline rule: when a test is identified as flaky, quarantine it immediately. Move it out of the blocking merge pipeline into a separate non-blocking suite until it is diagnosed and fixed. Do not let one bad test hold back developer velocity.

Continuous integration is only as good as the reliability of its test feedback loop. By establishing data isolation, avoiding timing bugs, and locking down test environments, you restore team confidence in your automated pipelines.
