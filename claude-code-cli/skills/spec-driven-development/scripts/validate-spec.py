#!/usr/bin/env python3
"""
SOLARIA Spec-Driven Development - Specification Validator
Validates that specification documents contain all required sections.

Usage: python validate-spec.py docs/specs/feature-name.md
"""

import sys
import re
from pathlib import Path
from typing import List, Tuple

# Required sections for a valid spec
REQUIRED_SECTIONS = [
    ('## Overview', 'Overview section'),
    ('## Acceptance Criteria', 'Acceptance Criteria section'),
    ('## Technical Design', 'Technical Design section'),
    ('## Dependencies', 'Dependencies section'),
    ('## Test Plan', 'Test Plan section'),
]

# Recommended sections
RECOMMENDED_SECTIONS = [
    ('## API Contract', 'API Contract section'),
    ('## Security Considerations', 'Security Considerations section'),
    ('## Rollout Plan', 'Rollout Plan section'),
]

# Patterns to check for completeness
TODO_PATTERN = r'\[TODO[:\]s]'
EMPTY_CHECKBOX = r'- \[ \] $'
PLACEHOLDER_PATTERNS = [
    r'\[TODO\]',
    r'\[TODO:.*?\]',
    r'\[Name\]',
    r'\[Description\]',
    r'\[purpose\]',
]


def validate_spec(filepath: str) -> Tuple[bool, List[str], List[str]]:
    """
    Validate a specification document.

    Returns:
        Tuple of (is_valid, errors, warnings)
    """
    errors = []
    warnings = []

    path = Path(filepath)

    if not path.exists():
        return False, [f"File not found: {filepath}"], []

    try:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        return False, [f"Error reading file: {e}"], []

    # Check for required sections
    for section, name in REQUIRED_SECTIONS:
        if section not in content:
            errors.append(f"Missing required section: {name}")

    # Check for recommended sections
    for section, name in RECOMMENDED_SECTIONS:
        if section not in content:
            warnings.append(f"Missing recommended section: {name}")

    # Check for TODO placeholders
    todos = re.findall(TODO_PATTERN, content, re.IGNORECASE)
    if todos:
        warnings.append(f"Found {len(todos)} TODO placeholders - spec may be incomplete")

    # Check for unfilled placeholders
    for pattern in PLACEHOLDER_PATTERNS:
        matches = re.findall(pattern, content)
        if matches:
            warnings.append(f"Found unfilled placeholder: {matches[0]}")

    # Check acceptance criteria exist
    ac_section = re.search(r'## Acceptance Criteria.*?(?=##|\Z)', content, re.DOTALL)
    if ac_section:
        checkboxes = re.findall(r'- \[[ x]\]', ac_section.group())
        if not checkboxes:
            errors.append("Acceptance Criteria section has no checkboxes")

    # Check dependencies section has table or content
    dep_section = re.search(r'## Dependencies.*?(?=##|\Z)', content, re.DOTALL)
    if dep_section:
        if 'PAT-006' not in content and 'External' in dep_section.group():
            warnings.append("External dependencies found but no PAT-006 reference")

    # Check test plan has actual tests
    test_section = re.search(r'## Test Plan.*?(?=##|\Z)', content, re.DOTALL)
    if test_section:
        if '|' not in test_section.group() and '- [ ]' not in test_section.group():
            warnings.append("Test Plan section appears empty")

    is_valid = len(errors) == 0
    return is_valid, errors, warnings


def print_report(filepath: str, is_valid: bool, errors: List[str], warnings: List[str]):
    """Print validation report."""
    print("\n" + "=" * 60)
    print("SOLARIA Specification Validation")
    print("=" * 60)
    print(f"File: {filepath}")
    print("-" * 60)

    if errors:
        print(f"\n❌ ERRORS ({len(errors)}):")
        for error in errors:
            print(f"  - {error}")

    if warnings:
        print(f"\n⚠️  WARNINGS ({len(warnings)}):")
        for warning in warnings:
            print(f"  - {warning}")

    print("\n" + "=" * 60)
    if is_valid:
        if warnings:
            print("STATUS: ✓ VALID (with warnings)")
            print("The specification has all required sections but may need review.")
        else:
            print("STATUS: ✓ VALID")
            print("The specification is complete and ready for implementation.")
    else:
        print("STATUS: ✗ INVALID")
        print("The specification is missing required sections.")
        print("Please address the errors before proceeding to implementation.")
    print("=" * 60)


def main():
    if len(sys.argv) < 2:
        print("Usage: python validate-spec.py <spec-file.md>")
        print("")
        print("Examples:")
        print("  python validate-spec.py docs/specs/user-auth.md")
        print("  python validate-spec.py docs/specs/*.md  # Validate multiple")
        sys.exit(1)

    all_valid = True

    for filepath in sys.argv[1:]:
        is_valid, errors, warnings = validate_spec(filepath)
        print_report(filepath, is_valid, errors, warnings)
        if not is_valid:
            all_valid = False

    sys.exit(0 if all_valid else 1)


if __name__ == '__main__':
    main()
